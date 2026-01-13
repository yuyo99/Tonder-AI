"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { PaymentMethod } from "@/types";

interface PaymentMethodData {
  method: PaymentMethod;
  count: number;
  percentage: number;
}

interface PaymentMethodChartProps {
  data: PaymentMethodData[];
}

const COLORS: Record<PaymentMethod, string> = {
  card: "#0066FF",
  spei: "#22C55E",
  oxxo: "#F59E0B",
  paypal: "#3B82F6",
  crypto: "#8B5CF6",
};

const METHOD_LABELS: Record<PaymentMethod, string> = {
  card: "Card",
  spei: "SPEI",
  oxxo: "OXXO",
  paypal: "PayPal",
  crypto: "Crypto",
};

export function PaymentMethodChart({ data }: PaymentMethodChartProps) {
  const chartData = data.map((item) => ({
    name: METHOD_LABELS[item.method],
    value: item.count,
    percentage: item.percentage,
    color: COLORS[item.method],
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          formatter={(value: number, name: string, props: { payload: { percentage: number } }) => [
            `${value.toLocaleString()} (${props.payload.percentage}%)`,
            name,
          ]}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => (
            <span className="text-sm text-muted-foreground">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
