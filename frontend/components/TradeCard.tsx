"use client";

import React, { useState } from "react";

const tokens = [
  {
    name: "Gold",
    symbol: "GOLD",
    logo: "/tokenGold.svg",
    price: 50542.2,
  },
  {
    name: "Silver",
    symbol: "SLV",
    logo: "/tokenSilver.svg",
    price: 50542.2,
  },
  {
    name: "Bronze",
    symbol: "BRZ",
    logo: "/tokenBronze.svg",
    price: 50542.2,
  },
  { name: "ETH", symbol: "ETH", logo: "/tokenEth.svg", price: 50429.5 },
  // Add more tokens here as needed
];

const TradeCard = () => {
  const [sellToken, setSellToken] = useState(tokens[0]);
  const [buyToken, setBuyToken] = useState(tokens[1]);

  return (
    <div className="bg-cardBg bg-opacity-10 p-8 rounded-lg text-white  w-full md:w-1/3">
      <div className="flex flex-col items-center justify-center ">
        {/* Sell Section */}
        <div className="flex flex-col bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-white text-lg font-semibold">You Sell</div>
            <div className="text-3xl text-white">32.5</div>
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
              ~${sellToken.price.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Exchange Icon */}
        <div className="flex items-center justify-center my-3">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
            <img src="/transfer.svg" alt="Exchange" className="w-6 h-6" />
          </div>
        </div>

        {/* Buy Section */}
        <div className="flex flex-col bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-white text-lg font-semibold">You Buy</div>
            <div className="text-3xl text-white">6953.2</div>
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
            <div className="text-gray-400 text-sm">
              ~${buyToken.price.toFixed(1)}
            </div>
          </div>
          <div className="mt-2 text-gray-400 text-right">Balance 0</div>
        </div>
      </div>
      <div className="flex justify-center">
        <button className="btn mt-2 text-center bg-green-600 rounded-lg shadow-lg w-full max-w-md p-2">
          Buy
        </button>
      </div>
    </div>
  );
};

export default TradeCard;
