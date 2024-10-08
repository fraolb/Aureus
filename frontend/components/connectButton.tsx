"use client";

import { useEffect, useRef } from "react";
import {
  useConnectModal,
  useAccountModal,
  useChainModal,
} from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
//import { emojiAvatarForAddress } from "@/lib/emojiAvatarForAddress";

export const ConnectBtn = () => {
  const { isConnecting, address, isConnected, chain } = useAccount();
  //   const { color: backgroundColor, emoji } = emojiAvatarForAddress(
  //     address ?? ""
  //   );

  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const { disconnect } = useDisconnect();

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
  }, []);

  if (!isConnected) {
    return (
      <button
        className="btn"
        onClick={async () => {
          // Disconnecting wallet first because sometimes when is connected but the user is not connected
          if (isConnected) {
            disconnect();
          }
          openConnectModal?.();
        }}
        disabled={isConnecting}
      >
        {isConnecting ? "Connecting..." : "Connect your wallet"}
      </button>
    );
  }

  if (isConnected && !chain) {
    return (
      <button className="btn" onClick={openChainModal}>
        Wrong network
      </button>
    );
  }

  return (
    <div className="max-w-5xl w-full flex items-center justify-between  gap-2">
      <div
        className="flex justify-center items-center px-4 py-2  bg-cardBg bg-opacity-10 rounded-xl font-mono font-bold gap-x-2 cursor-pointer"
        onClick={async () => openAccountModal?.()}
      >
        <div
          role="button"
          tabIndex={1}
          className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{
            //backgroundColor,
            boxShadow: "0px 2px 2px 0px rgba(81, 98, 255, 0.20)",
          }}
        >
          <img src="/tokenEth.svg" alt="Exchange" className="w-6 h-6" />
        </div>
        <p>{`${address?.slice(0, 4)}...${address?.slice(-4)}`}</p>
      </div>
      <button
        className="btn flex justify-center items-center px-4 py-2 bg-cardBg bg-opacity-10 rounded-xl font-mono font-bold gap-x-2 cursor-pointer"
        onClick={openChainModal}
      >
        Switch Network
      </button>
    </div>
  );
};
