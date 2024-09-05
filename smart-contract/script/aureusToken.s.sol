// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {HelperConfig} from "./HelperConfig.sol";
import {aureusToken} from "../src/aureusToken.sol";

contract DeployAUREUS is Script {
    string constant alpacaMintSource = "./functions/sources/alpacaBalance.js";
    string constant alpacaRedeemSource = "./functions/sources/alpacaBalance.js";

    function run() external {
        vm.startBroadcast();
        deployAUREUS(
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
            redemptionCoin,
            usdcToken,
            tokenPriceFeed,
            usdcPriceFeed
        );
        return aToken;
    }
}
