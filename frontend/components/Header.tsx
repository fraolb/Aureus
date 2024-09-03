import React from "react";
import { ConnectBtn } from "./connectButton";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-darkBg">
      <div className="text-white text-2xl font-bold">Aureus</div>
      <nav className="space-x-4">
        <button className="text-white">Buy</button>
        <button className="text-white">Bridges</button>
      </nav>
      <div className="flex space-x-4 items-center">
        <ConnectBtn />
      </div>
    </header>
  );
};

export default Header;
