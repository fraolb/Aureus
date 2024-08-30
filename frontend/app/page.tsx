import Image from "next/image";
import Header from "@/components/Header";
import TradeCard from "@/components/TradeCard";
import Chart from "@/components/Chart";

export default function Home() {
  return (
    <div className="min-h-screen bg-darkBg">
      <Header />
      <div className="flex flex-col gap-2 md:flex-row justify-around p-8 space-y-8 md:space-y-0">
        <Chart />
        <TradeCard />
      </div>
    </div>
  );
}
