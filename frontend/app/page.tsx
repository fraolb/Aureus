import Image from "next/image";
import Header from "@/components/Header";
import TradeCard from "@/components/TradeCard";
import TokenChart from "@/components/Chart";
import Profile from "@/components/profile";

export default function Home() {
  return (
    <div className="min-h-screen bg-darkBg">
      <Header />
      <div className="flex flex-col gap-2 md:flex-row justify-around p-8 space-y-8 md:space-y-0">
        <TokenChart tokenId="bitcoin" />
        <TradeCard />
      </div>
    </div>
  );
}
