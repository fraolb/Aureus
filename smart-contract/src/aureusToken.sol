// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title AureusToken
 * @author Fraol Bereket
 * @notice This is the Aureus tokens contract. These are directly pegged tokens that are backed by real-world assets.
 */
contract AureusToken is FunctionsClient, ConfirmedOwner, ERC20 {
    using FunctionsRequest for FunctionsRequest.Request;
    using Strings for uint256;

    //// errors
    error aToken__NotEnoughCollateral();
    error aToken__BelowMinimumRedemption();
    error aToken__RedemptionFailed();

    enum MintOrRedeem {
        mint,
        redeem
    }

    struct aTokenRequest {
        uint256 amountOfToken;
        address requester;
        MintOrRedeem mintOrRedeem;
    }

    // math constants
    uint256 constant PRECISION = 1e18;
    uint256 constant ADDITIONAL_FEED_PRECISION = 1e10;
    uint256 constant COLLATERAL_RATION = 200;
    uint256 constant COLLATERAL_PRECISION = 100;
    uint256 constant MINIMUM_WITHDRAWL_AMOUNT = 100e18;

    /// variables
    uint32 private constant GAS_LIMIT = 300_000;
    bytes32 immutable i_donId;
    uint64 immutable i_subId;

    address immutable i_usdcToken;
    address immutable i_tokenPriceFeed;
    address immutable i_usdcPriceFeed;
    uint256 immutable i_collateralRatio;
    uint256 immutable i_minimumRedemptionAmount;

    address s_functionsRouter;
    string s_mintSource;
    string s_redeemSource;
    uint256 s_portfolioBalance;
    mapping(bytes32 requestId => aTokenRequest request)
        private s_requestIdToRequest;
    mapping(address user => uint256 pendingWithdrawlAmount)
        private s_userToWithdrawlAmount;

    mapping(bytes32 => string) private requestToToken;
    mapping(address => mapping(string => uint256)) private userWithdrawals;

    // Events
    event Response(bytes32 indexed requestId, bytes response, bytes err);

    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        address functionsRouter,
        uint64 subId,
        bytes32 donId,
        string memory mintSource,
        string memory redeemSource,
        address usdcToken,
        address tokenPriceFeed,
        address usdcPriceFeed,
        uint256 collateralRatio,
        uint256 minimumRedemptionAmount
    )
        FunctionsClient(functionsRouter)
        ConfirmedOwner(msg.sender)
        ERC20(tokenName, tokenSymbol)
    {
        i_subId = subId;
        i_donId = donId;
        s_mintSource = mintSource;
        s_redeemSource = redeemSource;
        i_usdcToken = usdcToken;
        i_tokenPriceFeed = tokenPriceFeed;
        i_usdcPriceFeed = usdcPriceFeed;
        i_collateralRatio = collateralRatio;
        i_minimumRedemptionAmount = minimumRedemptionAmount;
    }

    /**
     * @notice This function sends http req to see how much token is bought and mints the aureusToken
     * @param amount the amount of token to be minted
     */
    function sendMintRequest(
        uint256 amount
    ) external onlyOwner returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(s_mintSource);

        requestId = _sendRequest(req.encodeCBOR(), i_subId, GAS_LIMIT, i_donId);
        s_requestIdToRequest[requestId] = aTokenRequest(
            amount,
            msg.sender,
            MintOrRedeem.mint
        );

        return requestId;
    }

    /**
     * @notice This function is for users to sell their aureustokens to usdc.
     * it sells the token on the broker, then buy usdc on the broker and send usdc to the contract for the user to withdraw
     * @param amountToRedeem the amount of token to be sold
     */
    function sendRedeemRequest(
        uint256 amountToRedeem
    ) external returns (bytes32 requestId) {
        uint256 amountTokenInUsdc = getUsdcValueOfUsd(
            getUsdValueOfToken(amountToRedeem)
        );

        if (amountTokenInUsdc < MINIMUM_WITHDRAWL_AMOUNT) {
            revert aToken__BelowMinimumRedemption();
        }

        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(s_redeemSource);

        string[] memory args = new string[](2);
        args[0] = amountToRedeem.toString();
        args[1] = amountTokenInUsdc.toString();
        req.setArgs(args);

        requestId = _sendRequest(req.encodeCBOR(), i_subId, GAS_LIMIT, i_donId);
        s_requestIdToRequest[requestId] = aTokenRequest(
            amountToRedeem,
            msg.sender,
            MintOrRedeem.redeem
        );

        _burn(msg.sender, amountToRedeem);

        return requestId;
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_requestIdToRequest[requestId].mintOrRedeem == MintOrRedeem.mint) {
            _mintFulfillRequest(requestId, response);
        } else {
            _redeemFulfillRequest(requestId, response);
        }
    }

    /**
     * @notice returns the amount of token value in usd stored in the broker, then if we have enough token, we mint the aureusToken
     */
    function _mintFulfillRequest(
        bytes32 requestId,
        bytes memory response
    ) internal {
        uint256 amountOfTokensToMint = s_requestIdToRequest[requestId]
            .amountOfToken;
        s_portfolioBalance = uint256(bytes32(response));

        // if token collateral on broker > token to be minted -> mint
        // first check how much collateral we have on broker
        // then how much token we are minting
        if (
            _getCollateralRationAdjustedTotalBalance(amountOfTokensToMint) >
            s_portfolioBalance
        ) {
            revert aToken__NotEnoughCollateral();
        }

        if (amountOfTokensToMint != 0) {
            _mint(
                s_requestIdToRequest[requestId].requester,
                amountOfTokensToMint
            );
        }
    }

    function _redeemFulfillRequest(
        bytes32 requestId,
        bytes memory response
    ) internal {
        uint256 usdcAmount = uint256(bytes32(response));
        if (usdcAmount == 0) {
            uint256 amountOfTokenBurned = s_requestIdToRequest[requestId]
                .amountOfToken;
            _mint(
                s_requestIdToRequest[requestId].requester,
                amountOfTokenBurned
            );
            return;
        }

        s_userToWithdrawlAmount[
            s_requestIdToRequest[requestId].requester
        ] += usdcAmount;
    }

    function _getCollateralRationAdjustedTotalBalance(
        uint256 amountOfTokenToMint
    ) internal view returns (uint256) {
        uint256 calculatedNewTotalValue = getCalculatedTotalValue(
            amountOfTokenToMint
        );

        return
            (calculatedNewTotalValue * COLLATERAL_RATION) /
            COLLATERAL_PRECISION;
    }

    function getCalculatedTotalValue(
        uint256 amountOfTokenToMint
    ) internal view returns (uint256) {
        return
            ((totalSupply() + amountOfTokenToMint) * getTokenPrice) / PRECISION;
    }

    function getTokenPrice() public view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            i_tokenPriceFeed
        );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price) * ADDITIONAL_FEED_PRECISION;
    }

    function getUsdcPrice() public view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            i_usdcPriceFeed
        );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price) * ADDITIONAL_FEED_PRECISION;
    }

    function getUsdcValueOfUsd(
        uint256 usdAmount
    ) public view returns (uint256) {
        return (usdAmount * getUsdcPrice()) / PRECISION;
    }

    function getTokenValueOfUsd(
        uint256 tokenAmount
    ) public view returns (uint256) {
        return (tokenAmount * getTokenPrice()) / PRECISION;
    }

    function withdraw() external {
        uint256 amountToWithdraw = s_userToWithdrawlAmount[msg.sender];
        s_userToWithdrawlAmount[msg.sender] = 0;

        bool success = ERC20(i_usdcToken).transfer(
            msg.sender,
            amountToWithdraw
        );
        if (!success) {
            revert aToken__RedemptionFailed();
        }
    }
}
