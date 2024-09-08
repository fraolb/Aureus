// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {aureusToken} from "./aureusToken.sol";

contract BridgedAUREUS is aureusToken {
    error BridgedAUREUS__ERC20InvalidReceiver(address receiver);
    error BridgedAUREUS__ERC20InvalidSender(address sender);
    error BridgedAUREUS__ERC20InsufficientBalance(
        address account,
        uint256 balance,
        uint256 value
    );
    error BridgedAUREUS__NotBridge();

    address private immutable i_bridge;

    event BridgeMint(address indexed to, uint256 amount);
    event BridgeBurn(address indexed from, uint256 amount);

    modifier onlyBridge() {
        if (msg.sender != i_bridge) {
            revert BridgedAUREUS__NotBridge();
        }
        _;
    }

    constructor(
        address bridge,
        string memory tokenName,
        string memory tokenSymbol,
        address functionsRouter,
        uint64 subId,
        bytes32 donId,
        string memory mintSource,
        string memory redeemSource,
        address usdcToken,
        address tokenPriceFeed,
        address usdcPriceFeed
    )
        aureusToken(
            tokenName,
            tokenSymbol,
            functionsRouter,
            subId,
            donId,
            mintSource,
            redeemSource,
            usdcToken,
            tokenPriceFeed,
            usdcPriceFeed
        )
    {
        i_bridge = bridge;
    }

    function bridgeMint(address to, uint256 amount) external onlyBridge {
        emit BridgeMint(to, amount);
        _mint(to, amount);
    }

    function bridgeBurn(address from, uint256 amount) external onlyBridge {
        emit BridgeBurn(from, amount);
        _burn(from, amount);
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override {
        if (from != address(0)) {
            uint256 fromBalance = balanceOf(from);
            if (fromBalance < value) {
                revert BridgedAUREUS__ERC20InsufficientBalance(
                    from,
                    fromBalance,
                    value
                );
            }
            unchecked {
                _decreaseBalance(from, value);
            }
        }

        if (to != address(0)) {
            unchecked {
                _increaseBalance(to, value);
            }
        }
        emit Transfer(from, to, value);
    }

    function _decreaseBalance(address account, uint256 value) internal {
        uint256 currentBalance = balanceOf(account);
        _transfer(account, address(0), value); // Simplified balance decrease
    }

    function _increaseBalance(address account, uint256 value) internal {
        _transfer(address(0), account, value); // Simplified balance increase
    }

    /*//////////////////////////////////////////////////////////////
                             VIEW AND PURE
    //////////////////////////////////////////////////////////////*/
    function getBridge() external view returns (address) {
        return i_bridge;
    }
}
