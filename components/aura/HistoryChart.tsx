"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Item = { t: string; score: number };

export default function HistoryChart({ data }: { data: Item[] }) {
  return (
    <div className="w-full h-60">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeOpacity={0.2} />
          <XAxis dataKey="t" hide />
          <YAxis domain={[0,100]} />
          <Tooltip />
          <Line type="monotone" dataKey="score" strokeWidth={2} dot={false}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

