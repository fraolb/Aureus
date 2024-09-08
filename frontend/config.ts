import { http, createConfig } from "@wagmi/core";
import { mainnet, sepolia, baseSepolia } from "@wagmi/core/chains";

export const config = createConfig({
  chains: [baseSepolia, sepolia],
  transports: {
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
  },
});
