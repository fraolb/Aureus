// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title AureusToken
 * @author Fraol Bereket
 * @notice This is the Aureus tokens contract. These are directly pegged tokens that are backed by real-world assets.
 */
contract AureusToken is FunctionsClient, ConfirmedOwner, ERC20 {
    using FunctionsRequest for FunctionsRequest.Request;

    struct TokenInfo {
        string mintSource;
        string redeemSource;
        address priceFeed;
        uint256 collateralRatio;
        uint256 minimumRedemptionAmount;
    }

    /// variables
    string immutable i_mintSource;
    string immutable i_redeemSource;
    address immutable i_priceFeed;
    uint256 immutable i_collateralRatio;
    uint256 immutable i_minimumRedemptionAmount;

    mapping(string => TokenInfo) public tokenInfo;
    mapping(bytes32 => string) private requestToToken;
    mapping(address => mapping(string => uint256)) private userWithdrawals;

    uint32 private constant GAS_LIMIT = 300_000;
    bytes32 immutable i_donId;

    // Events
    event Response(bytes32 indexed requestId, bytes response, bytes err);

    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        address functionsRouter,
        bytes32 donId,
        string memory mintSource,
        string memory redeemSource,
        address priceFeed,
        uint256 collateralRatio,
        uint256 minimumRedemptionAmount
    )
        FunctionsClient(functionsRouter)
        ConfirmedOwner(msg.sender)
        ERC20(tokenName, tokenSymbol)
    {
        i_donId = donId;
        i_mintSource= mintSource,
        i_redeemSource= redeemSource,
        i_priceFeed= priceFeed,
        i_collateralRatio= collateralRatio,
        i_minimumRedemptionAmount= minimumRedemptionAmount
       
    }

    function sendMintRequest(
        string memory symbol,
        uint64 subscriptionId,
        uint256 amountOfTokensToMint
    ) external onlyOwner returns (bytes32 requestId) {
        TokenInfo memory info = tokenInfo[symbol];
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(info.mintSource);

        requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            GAS_LIMIT,
            i_donId
        );
        requestToToken[requestId] = symbol;

        return requestId;
    }

    function sendRedeemRequest(
        string memory symbol,
        uint64 subscriptionId,
        uint256 amountToRedeem
    ) external returns (bytes32 requestId) {
        TokenInfo memory info = tokenInfo[symbol];
        require(
            amountToRedeem >= info.minimumRedemptionAmount,
            "Below minimum redemption amount"
        );

        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(info.redeemSource);

        requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            GAS_LIMIT,
            i_donId
        );
        requestToToken[requestId] = symbol;

        _burn(msg.sender, amountToRedeem);
        return requestId;
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        string memory symbol = requestToToken[requestId];
        
    }

    function withdraw(string memory symbol) external {
        uint256 amountToWithdraw = userWithdrawals[msg.sender][symbol];
        userWithdrawals[msg.sender][symbol] = 0;
        // Transfer the corresponding token to the user
    }
}
