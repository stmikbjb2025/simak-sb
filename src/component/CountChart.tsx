"use client";
import Image from "next/image";

import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

const CountChart = ({ valueA, valueB }: { valueA: number, valueB: number }) => {
  const data = [
    {
      name: 'Total',
      count: valueA + valueB,
      fill: 'white',
    },
    {
      name: 'Girls',
      count: valueB,
      fill: '#FFDD99',
    },
    {
      name: 'Boys',
      count: valueA,
      fill: '#99BBFF',
    },
  ];
  return (
    <div className="w-full h-[75%] relative">
      <ResponsiveContainer>
        <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={32} data={data}>
          <RadialBar
            background
            dataKey="count"
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <Image
        src={"/maleFemale.png"}
        alt="male-female-icon"
        width={50} height={50}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  )
}

export default CountChart;