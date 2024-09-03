import React from "react";
import { ConnectBtn } from "./connectButton";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-darkBg">
      <div className=" text-2xl font-bold">Aureus</div>
      <nav className="space-x-4">
        <button className="">Buy</button>
        <button className="">Bridge</button>
      </nav>
      <div className="flex space-x-4 items-center">
        <ConnectBtn />
      </div>
    </header>
  );
};

export default Header;
