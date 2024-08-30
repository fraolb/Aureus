import React from "react";

const TradeCard = () => {
  return (
    <div className="bg-cardBg p-8 rounded-lg text-white w-full md:w-1/2">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Swap</h2>
        <div className="space-x-4">
          <button className="text-secondary">Limit</button>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center">
          <div className="text-sm">You Sell</div>
          <div className="text-sm">32.5 MATIC</div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm">You Buy</div>
          <div className="text-sm">6953.2 ETH</div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm">Rate</div>
          <div className="text-sm">0.0003848 ETH</div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm">Expires in</div>
          <div className="text-sm">7 Days</div>
        </div>
      </div>

      <div className="mt-8">
        <button className="w-full bg-primary py-2 rounded-lg">
          Set to market
        </button>
      </div>
    </div>
  );
};

export default TradeCard;
