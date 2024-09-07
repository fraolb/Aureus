"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TokenChart = ({ tokenId }: { tokenId: string }) => {
  const [chartData, setChartData] = useState([]);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);

  useEffect(() => {
    const fetchChartData = async () => {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart`,
        { params: { vs_currency: "usd", days: 30 } }
      );

      const data = response.data.prices.map((price: any) => ({
        time: new Date(price[0]).getDate(), // Display only the date
        value: price[1],
      }));

      // Calculate min and max values for the Y-axis
      const values = data.map((d: any) => d.value);
      setMinValue(Math.min(...values) * 0.98); // 2% buffer below min
      setMaxValue(Math.max(...values) * 1.02); // 2% buffer above max

      setChartData(data);
    };

    fetchChartData();
  }, [tokenId]);

  return (
    <div className="bg-cardBg bg-opacity-10 p-8 rounded-lg w-full md:w-1/2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="time" tickFormatter={(tick) => `${tick}`} />
          <YAxis
            domain={[minValue, maxValue]}
            tickFormatter={(value) => Math.round(value).toString()} // Convert to string
          />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TokenChart;
