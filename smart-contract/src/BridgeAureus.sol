// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

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

    constructor(address bridge) {
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

    function _burn(address account, uint256 value) internal {
        if (account == address(0)) {
            revert BridgedAUREUS__ERC20InvalidSender(address(0));
        }
        _update(account, address(0), value);
    }

    function _mint(address account, uint256 value) internal {
        if (account == address(0)) {
            revert BridgedAUREUS__ERC20InvalidReceiver(address(0));
        }
        _update(address(0), account, value);
    }

    /**
     * @dev Transfers a `value` amount of tokens from `from` to `to`, or alternatively mints (or burns) if `from`
     * (or `to`) is the zero address. All customizations to transfers, mints, and burns should be done by overriding
     * this function.
     *
     * Emits a {Transfer} event.
     */
    function _update(address from, address to, uint256 value) internal virtual {
        if (from == address(0)) {
            // Skipping this, we are using the address(this).balance as the total supply
            // _totalSupply += value;
        } else {
            uint256 fromBalance = balanceOf[from];
            if (fromBalance < value) {
                revert BridgedAUREUS__ERC20InsufficientBalance(
                    from,
                    fromBalance,
                    value
                );
            }
            unchecked {
                // Overflow not possible: value <= fromBalance <= totalSupply.
                balanceOf[from] = fromBalance - value;
            }
        }

        if (to == address(0)) {
            unchecked {
                // Skipping this, we are using the address(this).balance as the total supply
                // _totalSupply -= value;
            }
        } else {
            unchecked {
                // Overflow not possible: balance + value is at most totalSupply, which we know fits into a uint256.
                balanceOf[to] += value;
            }
        }
        emit Transfer(from, to, value);
    }

    /*//////////////////////////////////////////////////////////////
                             VIEW AND PURE
    //////////////////////////////////////////////////////////////*/
    function getBridge() external view returns (address) {
        return i_bridge;
    }
}
