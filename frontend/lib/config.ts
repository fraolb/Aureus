"use client";

import { http, createStorage, cookieStorage } from "wagmi";
import {
  sepolia,
  bscTestnet,
  blastSepolia,
  baseSepolia,
  avalancheFuji,
} from "wagmi/chains";
import { Chain, getDefaultConfig } from "@rainbow-me/rainbowkit";

const projectId = "4d9c3b0d7b2814d2c3a0e562017b56ee";

const supportedChains: Chain[] = [sepolia, baseSepolia, avalancheFuji];

export const config = getDefaultConfig({
  appName: "WalletConnection",
  projectId,
  chains: supportedChains as any,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: supportedChains.reduce(
    (obj, chain) => ({ ...obj, [chain.id]: http() }),
    {}
  ),
});
