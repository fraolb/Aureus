"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import { tokens } from "@/tokens";
import { ethers } from "ethers";
import { writeContract } from "@wagmi/core";
import { AureusABI } from "@/ABI/AureusToken";
import { BridgeABI } from "@/ABI/BridgeToken";
import { config } from "@/config";
import BridgeModal from "@/components/BridgeModal";
import { SignProtocolClient, SpMode, EvmChains } from "@ethsign/sp-sdk";

const networks: { name: string; logo: string; bridgeAddress: `0x${string}` }[] =
  [
    {
      name: "Base",
      logo: "/networkBase.svg",
      bridgeAddress: "0x4CC818bea2874a577DB8A0d7CbDd7da1c20fDfb4",
    },
    {
      name: "Avalanche",
      logo: "/networkAvax.svg",
      bridgeAddress: "0x4CC818bea2874a577DB8A0d7CbDd7da1c20fDfb4",
    },
    {
      name: "Arbitrum",
      logo: "/networkArbit.svg",
      bridgeAddress: "0xCbD38A739511cBC7149227C9f46b0A674418795E",
    },
    {
      name: "Sepolia",
      logo: "/tokenEth.svg",
      bridgeAddress: "0xCbD38A739511cBC7149227C9f46b0A674418795E",
    },
  ];

interface notificationInterfact {
  message: string;
  type: string;
}

const Page = () => {
  const [bridgedToken, setBridgedToken] = useState(tokens[0]);
  const [fromNetwork, setFromNetwork] = useState(networks[3]);
  const [toNetwork, setToNetwork] = useState(networks[0]);
  const [amount, setAmount] = useState(0);
  const [notification, setNotification] =
    useState<notificationInterfact | null>();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleBridge = () => {
    setIsModalOpen(true);
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return;
      }
      const amountToBridge = ethers.parseUnits(amount.toString(), 18);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const client = new SignProtocolClient(SpMode.OnChain, {
        chain: EvmChains.sepolia,
      });

      const createAttestationRes = await client.createAttestation({
        schemaId: "0x1f9",
        data: { address: (await signer).address, amount: amount, type: "mint" },
        indexingValue: "xxx",
      });
      if (createAttestationRes) {
        const result = await writeContract(config, {
          abi: AureusABI,
          address: fromNetwork.bridgeAddress,
          functionName: "sendMintRequest",
          args: [amountToBridge],
          chainId: 11155111,
        });

        console.log("Transaction result:", result);
        setTimeout(
          () =>
            setNotification({
              message: "Transactio submitted!",
              type: "success",
            }),
          3000
        );
      }
    } catch (error) {
      console.error(error);
      setTimeout(
        () =>
          setNotification({
            message: "Transactio submitted!",
            type: "success",
          }),
        3000
      );
    }
    setTimeout(() => setNotification(null), 5000);
    setTimeout(() => setLoading(false), 3000);
    setTimeout(() => setIsModalOpen(false), 3000);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-darkBg ">
      <Header />
      <div className="flex flex-col gap-2 md:flex-row justify-around p-8 space-y-8 md:space-y-0">
        {notification && (
          <div
            className={`fixed top-0 left-1/2 transform -translate-x-1/2 mt-12 p-2 px-4 w-3/4 rounded shadow-lg z-10 ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {notification.message}
          </div>
        )}
        <div className="bg-cardBg bg-opacity-10 p-8 rounded-lg text-white ">
          <div className="flex flex-col items-center justify-center ">
            <div className="flex flex-col bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-6 gap-2">
                <div className="text-white text-lg font-semibold">
                  You Bridge
                </div>

                <div className="text-xl text-white">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="bg-gray-700 text-white p-2 rounded"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <img
                    src={bridgedToken.logo}
                    alt={`${fromNetwork.name} Token`}
                    className="w-6 h-6 mr-2"
                  />
                  <select
                    className="bg-gray-700 text-white p-2 rounded"
                    onChange={(e) =>
                      setBridgedToken(
                        tokens.find((token) => token.name === e.target.value)!
                      )
                    }
                  >
                    {tokens.map((token) => (
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
                    src={fromNetwork.logo}
                    alt={`${fromNetwork.name} Network`}
                    className="w-6 h-6 mr-2"
                  />
                  <select
                    value={fromNetwork.name}
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
            <button
              className="btn mt-2 text-center bg-green-600 rounded-lg shadow-lg w-full max-w-md p-2"
              onClick={() => handleBridge()}
            >
              Bridge
            </button>
          </div>
        </div>
      </div>
      <BridgeModal
        isOpen={isModalOpen}
        loading={loading}
        onClose={handleCloseModal}
        onApprove={handleApprove}
      />
    </div>
  );
};

export default Page;
