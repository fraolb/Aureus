// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {aureusToken} from "../src/aureusToken.sol";

contract DeployAUREUS is Script {
    string constant alpacaMintSource = "./functions/sources/alpacaBalance.js";
    string constant alpacaRedeemSource = "./functions/sources/alpacaBalance.js";

    function run() external {
        string memory tokenName = "AUREUS";
        string memory tokenSymbol = "AUR";
        address functionsRouter = 0x00000;
        uint64 subId = 1;
        bytes32 donId = 0x00000;
        string memory mintSource = alpacaMintSource;
        string memory redeemSource = alpacaRedeemSource;
        address usdcToken = 0x00000;
        address tokenPriceFeed = 0x00000;
        address usdcPriceFeed = 0x00000;

        vm.startBroadcast();
        aureusToken aToken = deployAUREUS(
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
        );
        vm.stopBroadcast();
    }

    function deployAUREUS(
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
    ) public returns (aureusToken) {
        aureusToken aToken = new aureusToken(
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
        );
        return aToken;
    }
}
