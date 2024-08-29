// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title aureusToken
 * @author Fraol Bereket
 * @notice This is the aureus tokens contract. this are directly pegged tokens that are backed by real world assets.
 */
contract aureusToken is FunctionsClient, ConfirmedOwner, ERC20 {
    using FunctionsRequest for FunctionsRequest.Request;

    // JavaScript source code
    // Fetch character name from the Star Wars API.
    // Documentation: https://swapi.info/people
    string source =
        "const characterId = args[0];"
        "const apiResponse = await Functions.makeHttpRequest({"
        "url: `https://swapi.info/api/people/${characterId}/`"
        "});"
        "if (apiResponse.error) {"
        "throw Error('Request failed');"
        "}"
        "const { data } = apiResponse;"
        "return Functions.encodeString(data.name);";

    // State variables to store the last request ID, response, and error
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;

    //Callback gas limit
    uint32 gasLimit = 1500000;

    /// immutable values
    bytes32 immutable i_donId;

    constructor(
        string memory tokenName,
        string memory tokenId,
        address functionsRouter,
        bytes32 donId,
        address tokenPriceFeed,
        address usdcPriceFeed
    )
        FunctionsClient(functionsRouter)
        ConfirmedOwner(msg.sender)
        ERC20(tokenName, tokenId)
    {
        i_donId = donId;
    }

    /**
     * @notice Sends an HTTP request for character information
     * @param subscriptionId The ID for the Chainlink subscription
     * @param args The arguments to pass to the HTTP request
     * @return requestId The ID of the request
     */
    function sendRequest(
        uint64 subscriptionId,
        string[] calldata args
    ) external onlyOwner returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source); // Initialize the request with JS code
        if (args.length > 0) req.setArgs(args); // Set the arguments for the request

        // Send the request and store the request ID
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            i_donId
        );

        return s_lastRequestId;
    }

    /**
     * @notice Callback function for fulfilling a request
     * @param requestId The ID of the request to fulfill
     * @param response The HTTP response data
     * @param err Any errors from the Functions request
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            // revert UnexpectedRequestID(requestId); // Check if request IDs match
        }
        // Update the contract's state variables with the response and any errors
        // s_lastResponse = response;
        // character = string(response);
        // s_lastError = err;

        // Emit an event to log the response
        // emit Response(requestId, character, s_lastResponse, s_lastError);
    }
}
