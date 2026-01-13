"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/dashboard/metric-card";
import { mockRevenueBreakdown, mockMerchants } from "@/lib/mock-data";
import { formatCurrency, formatNumber } from "@/lib/utils";

const COLORS = {
  card: "#0066FF",
  spei: "#22C55E",
  oxxo: "#F59E0B",
  paypal: "#3B82F6",
  crypto: "#8B5CF6",
};

const TIER_COLORS = {
  enterprise: "#0066FF",
  growth: "#22C55E",
  starter: "#F59E0B",
};

export default function RevenuePage() {
  const [period, setPeriod] = useState("30d");
  const revenue = mockRevenueBreakdown;

  // Calculate totals
  const totalRevenue = revenue.byPaymentMethod.reduce((acc, m) => acc + m.revenue, 0);
  const avgFeePercent = 2.5; // Average fee percentage
  const projectedMRR = totalRevenue;
  const projectedARR = projectedMRR * 12;

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Revenue Analytics</h2>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          trend={{
            value: 12.5,
            direction: "up",
            label: "vs last period",
          }}
          icon={DollarSign}
          iconColor="text-green-600 bg-green-100 dark:bg-green-900/30"
        />
        <MetricCard
          title="Average Fee %"
          value={`${avgFeePercent}%`}
          subtitle="Weighted average across methods"
          icon={TrendingUp}
          iconColor="text-blue-600 bg-blue-100 dark:bg-blue-900/30"
        />
        <MetricCard
          title="Projected MRR"
          value={formatCurrency(projectedMRR)}
          trend={{
            value: 8.3,
            direction: "up",
            label: "growth",
          }}
          icon={Calendar}
          iconColor="text-purple-600 bg-purple-100 dark:bg-purple-900/30"
        />
        <MetricCard
          title="Projected ARR"
          value={formatCurrency(projectedARR)}
          subtitle="Based on current trends"
          icon={ArrowUpRight}
          iconColor="text-orange-600 bg-orange-100 dark:bg-orange-900/30"
        />
      </div>

      {/* Revenue Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={revenue.dailyTrend}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0066FF" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#0066FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
                className="text-muted-foreground"
              />
              <YAxis
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0066FF"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* By Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenue.byPaymentMethod.map((item) => ({
                    name: item.method.toUpperCase(),
                    value: item.revenue,
                    percentage: item.percentage,
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {revenue.byPaymentMethod.map((entry) => (
                    <Cell
                      key={entry.method}
                      fill={COLORS[entry.method as keyof typeof COLORS]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number, name: string, props: { payload: { percentage: number } }) => [
                    `${formatCurrency(value)} (${props.payload.percentage}%)`,
                    name,
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* By Merchant Tier */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Merchant Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenue.byMerchantTier} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  type="number"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="tier"
                  tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number, name: string, props: { payload: { percentage: number } }) => [
                    `${formatCurrency(value)} (${props.payload.percentage}%)`,
                    "Revenue",
                  ]}
                />
                <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                  {revenue.byMerchantTier.map((entry) => (
                    <Cell
                      key={entry.tier}
                      fill={TIER_COLORS[entry.tier as keyof typeof TIER_COLORS]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Revenue Generating Merchants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Top Revenue Generating Merchants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revenue.topMerchants.map((merchant, index) => {
              const maxRevenue = Math.max(
                ...revenue.topMerchants.map((m) => m.revenue)
              );
              const percentage = (merchant.revenue / maxRevenue) * 100;
              const merchantData = mockMerchants.find(
                (m) => m.merchantId === merchant.merchantId
              );

              return (
                <div key={merchant.merchantId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{merchant.merchantName}</p>
                        <p className="text-sm text-muted-foreground">
                          {merchantData?.tier && (
                            <Badge variant="outline" className="text-xs mr-2">
                              {merchantData.tier}
                            </Badge>
                          )}
                          {merchant.merchantId}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {formatCurrency(merchant.revenue)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {((merchant.revenue / totalRevenue) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Fee Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Analysis by Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            {[
              { method: "Card", fee: 2.9, transactions: 9140 },
              { method: "SPEI", fee: 1.5, transactions: 3047 },
              { method: "OXXO", fee: 3.5, transactions: 1523 },
              { method: "PayPal", fee: 2.5, transactions: 1066 },
              { method: "Crypto", fee: 1.0, transactions: 458 },
            ].map((item) => (
              <div
                key={item.method}
                className="p-4 rounded-lg border bg-muted/30"
              >
                <p className="text-sm text-muted-foreground">{item.method}</p>
                <p className="text-2xl font-bold">{item.fee}%</p>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(item.transactions)} transactions
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
