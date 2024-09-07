"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";

const networks = [
  {
    name: "Base",
    logo: "/networkBase.svg",
  },
  {
    name: "Avalanche",
    logo: "/networkAvax.svg",
  },
  {
    name: "Arbitrum",
    logo: "/networkArbit.svg",
  },
  { name: "ETH", logo: "/tokenEth.svg" },
];

const Page = () => {
  const [fromNetowork, setFromNetwork] = useState(networks[0]);
  const [toNetwork, setToNetwork] = useState(networks[1]);

  return (
    <div className="min-h-screen bg-darkBg ">
      <Header />
      <div className="flex flex-col gap-2 md:flex-row justify-around p-8 space-y-8 md:space-y-0">
        <div className="bg-cardBg bg-opacity-10 p-8 rounded-lg text-white ">
          <div className="flex flex-col items-center justify-center ">
            <div className="flex flex-col bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="text-white text-lg font-semibold">
                  You Bridge
                </div>
                <div className="text-3xl text-white">32.5</div>
              </div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <img
                    src={fromNetowork.logo}
                    alt={`${fromNetowork.name} Token`}
                    className="w-6 h-6 mr-2"
                  />
                  <select className="bg-gray-700 text-white p-2 rounded">
                    {networks.map((token) => (
                      <option key={token.name}>{token.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center my-6">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                <img src="/bridge.svg" alt="Exchange" className="w-6 h-6" />
              </div>
            </div>

            <div className="flex flex-col bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="text-white text-lg font-semibold">From</div>
                <div className="text-white text-lg font-semibold">To</div>
              </div>
              <div className="flex justify-between gap-2 items-center">
                <div className="flex items-center">
                  <img
                    src={fromNetowork.logo}
                    alt={`${fromNetowork.name} Network`}
                    className="w-6 h-6 mr-2"
                  />
                  <select
                    value={fromNetowork.name}
                    onChange={(e) =>
                      setFromNetwork(
                        networks.find(
                          (network) => network.name === e.target.value
                        )!
                      )
                    }
                    className="bg-gray-700 text-white p-2 rounded"
                  >
                    {networks.map((network) => (
                      <option key={network.name} value={network.name}>
                        {network.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center">
                  <img
                    src={toNetwork.logo}
                    alt={`${toNetwork.name} Network`}
                    className="w-6 h-6 mr-2"
                  />
                  <select
                    value={toNetwork.name}
                    onChange={(e) =>
                      setToNetwork(
                        networks.find(
                          (network) => network.name === e.target.value
                        )!
                      )
                    }
                    className="bg-gray-700 text-white p-2 rounded"
                  >
                    {networks.map((network) => (
                      <option key={network.name} value={network.name}>
                        {network.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-2 text-gray-400 text-right">
                Estimated Time
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button className="btn mt-2 text-center bg-green-600 rounded-lg shadow-lg w-full max-w-md p-2">
              Bridge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
