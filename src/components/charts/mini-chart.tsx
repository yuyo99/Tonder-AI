"use client";

import React from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface MiniChartProps {
  data: Array<{ hour: string; value: number }>;
  color?: string;
  height?: number;
}

export function MiniChart({ data, color = "#0066FF", height = 60 }: MiniChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`gradient-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          formatter={(value: number) => [value.toLocaleString(), ""]}
          labelFormatter={(label) => `${label}:00`}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#gradient-${color.replace("#", "")})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
