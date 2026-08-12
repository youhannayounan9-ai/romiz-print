"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { siteConfig } from "../config/site";

export function CategoryBarChart({ catData }: { catData: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={catData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
        <XAxis
          dataKey="category"
          tick={{ fontSize: 10, fill: "#9CA3AF" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#9CA3AF" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "none",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            fontSize: 12,
          }}
          cursor={{ fill: "#F3F4F6" }}
        />
        <Bar
          dataKey="count"
          name="Quotes"
          fill={siteConfig.colors.primary}
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TimeLineChart({ timeData }: { timeData: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={timeData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "#9CA3AF" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#9CA3AF" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "none",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            fontSize: 12,
          }}
        />
        <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
        <Line
          type="monotone"
          dataKey="count"
          name="Daily"
          stroke="#9CA3AF"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="cumulative"
          name="Cumulative"
          stroke={siteConfig.colors.accent}
          strokeWidth={2.5}
          dot={{ fill: siteConfig.colors.accent, r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
