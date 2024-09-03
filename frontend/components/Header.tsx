import React from "react";
import Link from "next/link";
import { ConnectBtn } from "./connectButton";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-darkBg">
      <div className=" text-2xl font-bold">Aureus</div>
      <nav className="space-x-4">
        <Link href={"/"} className="">
          Buy
        </Link>
        <Link href={"/bridge"} className="">
          Bridge
        </Link>
      </nav>
      <div className="flex space-x-4 items-center">
        <ConnectBtn />
      </div>
    </header>
  );
};

export default Header;
