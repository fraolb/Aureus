import { ethers } from "ethers";
import { useEffect, useState } from "react";
import AggregatorV3InterfaceABI from "@chainlink/contracts/abi/v0.8/AggregatorV3Interface.json";

const chainlinkEthPriceFeedAddress =
  "0xC5981F461d74c46eB4b0CF3f4Ec79f025573B0Ea";

const fetchPriceFromChainlink = async (priceFeedAddress: string) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const priceFeed = new ethers.Contract(
    priceFeedAddress,
    AggregatorV3InterfaceABI,
    provider
  );
  const roundData = await priceFeed.latestRoundData();
  const price = roundData.answer / 10 ** 8; // Adjust decimal places
  return price;
};

export default fetchPriceFromChainlink;
