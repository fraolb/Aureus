"use client";

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import fetchPriceFromChainlink from "./fetchPriceFromChainlink";
import { tokens } from "@/tokens";
import BuyModal from "./BuyModal";
import { ethers } from "ethers";
import { AureusABI } from "@/ABI/AureusToken";
import { writeContract } from "@wagmi/core";
import { config } from "@/config";
import { SignProtocolClient, SpMode, EvmChains } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";

interface Token {
  name: string;
  priceFeed: string;
  chain: {
    [network: string]: {
      token: string;
      bridge: string;
    };
  };
}
interface notificationInterfact {
  message: string;
  type: string;
}

const TradeCard = () => {
  const [sellToken, setSellToken] = useState(tokens[3]);
  const [buyToken, setBuyToken] = useState(tokens[0]);
  const [sellPrice, setSellPrice] = useState(0);
  const [sellPriceInUsd, setSellPriceInUsd] = useState(0);
  const [buyPrice, setBuyPrice] = useState(0);
  const [conversion, setConversion] = useState(0);
  const { address } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [notification, setNotification] =
    useState<notificationInterfact | null>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      const sellTokenPriceInUsd = await fetchPriceFromChainlink(
        sellToken.priceFeed
      );
      const buyTokenPrice = await fetchPriceFromChainlink(buyToken.priceFeed);

      setSellPriceInUsd(sellTokenPriceInUsd * sellPrice);

      // Update conversion whenever sellPrice or token prices change
      if (sellTokenPriceInUsd && buyTokenPrice) {
        const convertedValue =
          (sellTokenPriceInUsd * sellPrice) / buyTokenPrice;
        setConversion(convertedValue);
        setBuyPrice(buyTokenPrice * convertedValue);
      }
    };

    fetchPrices();
  }, [sellToken, buyToken, sellPrice]);

  const handleSwitch = () => {
    setSellToken(buyToken);
    setBuyToken(sellToken);
  };

  const handleBuy = () => {
    setIsModalOpen(true);
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();

      const amount = ethers.parseUnits(sellPrice.toString(), 18);

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
          address: "0xa2e1dbdD398C17Ab87CE103BeE079fb8DD4b4024",
          functionName: "sendMintRequest",
          args: [amount],
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
            message: "Transactio Failed!",
            type: "error",
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
    <div className="bg-cardBg bg-opacity-10 p-8 rounded-lg text-white w-full md:w-1/3">
      {notification && (
        <div
          className={`fixed top-0 left-1/2 transform -translate-x-1/2 mt-12 p-2 px-4 w-3/4 rounded shadow-lg z-10 ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {notification.message}
        </div>
      )}
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
      <BuyModal
        isOpen={isModalOpen}
        loading={loading}
        onClose={handleCloseModal}
        onApprove={handleApprove}
      />
    </div>
  );
};

export default TradeCard;
