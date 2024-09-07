import { ethers } from "ethers";
import AggregatorV3InterfaceABI from "@chainlink/contracts/abi/v0.8/AggregatorV3Interface.json";

const fetchPriceFromChainlink = async (priceFeedAddress: string) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const priceFeed = new ethers.Contract(
    priceFeedAddress,
    AggregatorV3InterfaceABI,
    provider
  );

  // Fetch the latest round data
  const roundData = await priceFeed.latestRoundData();

  // Extract the answer as a BigNumber
  const priceBigNumber = roundData.answer;

  // Convert BigNumber to a JavaScript number, considering the decimals
  // Assuming the price is in 8 decimal places, adjust accordingly
  const price = parseFloat(ethers.formatUnits(priceBigNumber, 8));

  console.log("The price feed is ", price);
  return price;
};

export default fetchPriceFromChainlink;
