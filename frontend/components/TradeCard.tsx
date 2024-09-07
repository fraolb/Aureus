"use client";

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import fetchPriceFromChainlink from "./fetchPriceFromChainlink"; // Import the price fetch function

const tokens = [
  // Define your tokens here
  {
    name: "Gold",
    symbol: "GOLD",
    logo: "/tokenGold.svg",
    priceFeed: "0xC5981F461d74c46eB4b0CF3f4Ec79f025573B0Ea",
  },
  {
    name: "Silver",
    symbol: "SLV",
    logo: "/tokenSilver.svg",
    priceFeed: "0xC5981F461d74c46eB4b0CF3f4Ec79f025573B0Ea",
  },
  {
    name: "Bronze",
    symbol: "BRZ",
    logo: "/tokenBronze.svg",
    priceFeed: "0xC5981F461d74c46eB4b0CF3f4Ec79f025573B0Ea",
  },
  {
    name: "ETH",
    symbol: "ETH",
    logo: "/tokenEth.svg",
    priceFeed: "0xC5981F461d74c46eB4b0CF3f4Ec79f025573B0Ea",
  },
  // Add more tokens with their priceFeed addresses
];

const TradeCard = () => {
  const [sellToken, setSellToken] = useState(tokens[0]);
  const [buyToken, setBuyToken] = useState(tokens[1]);
  const [sellPrice, setSellPrice] = useState(0);
  const [sellPriceInUsd, setSellPriceInUsd] = useState(0);
  const [buyPrice, setBuyPrice] = useState(0);
  const [conversion, setConversion] = useState(0);
  const { address } = useAccount();

  useEffect(() => {
    const fetchPrices = async () => {
      const sellTokenPriceInUsd = await fetchPriceFromChainlink(
        sellToken.priceFeed
      );
      const buyTokenPrice = await fetchPriceFromChainlink(buyToken.priceFeed);

      setSellPriceInUsd(sellTokenPriceInUsd);
      setBuyPrice(buyTokenPrice);

      // Update conversion whenever sellPrice or token prices change
      if (sellTokenPriceInUsd && buyTokenPrice) {
        const convertedValue = sellPriceInUsd / buyTokenPrice;
        setConversion(convertedValue);
      }
    };

    fetchPrices();
  }, [sellToken, buyToken, sellPrice]);

  const handleSwitch = () => {
    setSellToken(buyToken);
    setBuyToken(sellToken);
  };

  const handleBuy = () => {
    // buyTokens();
  };

  return (
    <div className="bg-cardBg bg-opacity-10 p-8 rounded-lg text-white w-full md:w-1/3">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-white text-lg font-semibold">You Sell</div>
            <div className="text-xl text-white">
              <input
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(Number(e.target.value))}
                className="bg-gray-700 text-white p-2 rounded"
              />
            </div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <img
                src={sellToken.logo}
                alt={`${sellToken.name} Token`}
                className="w-6 h-6 mr-2"
              />
              <select
                value={sellToken.symbol}
                onChange={(e) =>
                  setSellToken(
                    tokens.find((token) => token.symbol === e.target.value)!
                  )
                }
                className="bg-gray-700 text-white p-2 rounded"
              >
                {tokens.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-gray-400 text-sm">
              ~${sellPriceInUsd.toFixed(1)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center my-3">
          <button
            onClick={handleSwitch}
            className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center"
          >
            <img src="/transfer.svg" alt="Exchange" className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-white text-lg font-semibold">You Buy</div>
            <div className="text-3xl text-white">{conversion.toFixed(2)}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src={buyToken.logo}
                alt={`${buyToken.name} Token`}
                className="w-6 h-6 mr-2"
              />
              <select
                value={buyToken.symbol}
                onChange={(e) =>
                  setBuyToken(
                    tokens.find((token) => token.symbol === e.target.value)!
                  )
                }
                className="bg-gray-700 text-white p-2 rounded"
              >
                {tokens.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-gray-400 text-sm">~${buyPrice.toFixed(1)}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          className="btn mt-2 text-center bg-green-600 rounded-lg shadow-lg w-full max-w-md p-2"
          onClick={handleBuy}
          disabled={!address} // Ensure the wallet is connected
        >
          Buy
        </button>
      </div>
    </div>
  );
};

export default TradeCard;
