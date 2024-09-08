interface ChainDetails {
  token: `0x${string}`;
  bridge: `0x${string}`;
}

interface ChainType {
  sepolia: ChainDetails;
  base: ChainDetails;
}

interface TokenType {
  name: string;
  symbol: string;
  logo: string;
  priceFeed: `0x${string}`;
  chain: ChainType;
}

export const tokens: TokenType[] = [
  {
    name: "Gold",
    symbol: "GOLD",
    logo: "/tokenGold.svg",
    priceFeed: "0xC5981F461d74c46eB4b0CF3f4Ec79f025573B0Ea",
    chain: {
      sepolia: {
        token: "0xa2e1dbdD398C17Ab87CE103BeE079fb8DD4b4024",
        bridge: "0xCbD38A739511cBC7149227C9f46b0A674418795E",
      },
      base: {
        token: "0x25342A333930d405d81Fc1Ff339C8bf9d4D3800F",
        bridge: "0x4CC818bea2874a577DB8A0d7CbDd7da1c20fDfb4",
      },
    },
  },
  {
    name: "Silver",
    symbol: "SLV",
    logo: "/tokenSilver.svg",
    priceFeed: "0x4b531A318B0e44B549F3b2f824721b3D0d51930A",
    chain: {
      sepolia: {
        token: "0xa2e1dbdD398C17Ab87CE103BeE079fb8DD4b4024",
        bridge: "0xCbD38A739511cBC7149227C9f46b0A674418795E",
      },
      base: {
        token: "0x25342A333930d405d81Fc1Ff339C8bf9d4D3800F",
        bridge: "0x4CC818bea2874a577DB8A0d7CbDd7da1c20fDfb4",
      },
    },
  },
  {
    name: "Bronze",
    symbol: "BRZ",
    logo: "/tokenBronze.svg",
    priceFeed: "0xC5981F461d74c46eB4b0CF3f4Ec79f025573B0Ea",
    chain: {
      sepolia: {
        token: "0xa2e1dbdD398C17Ab87CE103BeE079fb8DD4b4024",
        bridge: "0xCbD38A739511cBC7149227C9f46b0A674418795E",
      },
      base: {
        token: "0x25342A333930d405d81Fc1Ff339C8bf9d4D3800F",
        bridge: "0x4CC818bea2874a577DB8A0d7CbDd7da1c20fDfb4",
      },
    },
  },
  {
    name: "ETH",
    symbol: "ETH",
    logo: "/tokenEth.svg",
    priceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    chain: {
      sepolia: {
        token: "0xa2e1dbdD398C17Ab87CE103BeE079fb8DD4b4024",
        bridge: "0xCbD38A739511cBC7149227C9f46b0A674418795E",
      },
      base: {
        token: "0x25342A333930d405d81Fc1Ff339C8bf9d4D3800F",
        bridge: "0x4CC818bea2874a577DB8A0d7CbDd7da1c20fDfb4",
      },
    },
  },
];
