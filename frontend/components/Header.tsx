import React from "react";

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-darkBg">
      <div className="text-white text-2xl font-bold">Aureus</div>
      <nav className="space-x-4">
        <button className="text-white">Buy Crypto</button>
        <button className="text-white">Bridges</button>
      </nav>
      <div className="flex space-x-4 items-center">
        <button className="text-white">Ethereum</button>
        <button className="bg-primary text-white px-4 py-2 rounded-lg">
          Connect Wallet
        </button>
      </div>
    </header>
  );
};

export default Header;
