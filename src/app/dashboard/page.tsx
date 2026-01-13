"use client";

import React from "react";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Users,
  Clock,
  Wallet,
  Activity,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { AlertsSummary } from "@/components/dashboard/alerts-summary";
import { TopMerchants } from "@/components/dashboard/top-merchants";
import { MiniChart } from "@/components/charts/mini-chart";
import { PaymentMethodChart } from "@/components/charts/payment-method-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  mockDashboardOverview,
  mockTransactionStats,
  generateRecentTransactions,
  generateAlerts,
  getTopMerchantsByVolume,
  get24HourTrend,
} from "@/lib/mock-data";
import { formatCurrency, formatNumber, formatPercentage, formatDuration } from "@/lib/utils";

export default function DashboardOverviewPage() {
  // In a real app, these would be fetched from the API using TanStack Query
  const overview = mockDashboardOverview;
  const transactionStats = mockTransactionStats;
  const recentTransactions = generateRecentTransactions(10);
  const alerts = generateAlerts(5);
  const topMerchants = getTopMerchantsByVolume();

  // 24-hour trend data for mini charts
  const volumeTrend = get24HourTrend("volume");
  const transactionsTrend = get24HourTrend("transactions");
  const successRateTrend = get24HourTrend("successRate");

  return (
    <div className="space-y-6">
      {/* KPI Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Payment Volume (Today)"
          value={formatCurrency(overview.tpv.today)}
          subtitle={`Week: ${formatCurrency(overview.tpv.thisWeek)} | Month: ${formatCurrency(overview.tpv.thisMonth)}`}
          trend={{
            value: overview.tpv.changePercent,
            direction: overview.tpv.changePercent >= 0 ? "up" : "down",
            label: "vs yesterday",
          }}
          icon={DollarSign}
          iconColor="text-green-600 bg-green-100 dark:bg-green-900/30"
          chart={<MiniChart data={volumeTrend} color="#22C55E" />}
        />

        <MetricCard
          title="Gross Success Rate"
          value={formatPercentage(overview.successRate.value)}
          subtitle={`Target: ${overview.successRate.target}%`}
          trend={{
            value: overview.successRate.value - overview.successRate.target,
            direction: overview.successRate.trend,
            label: "vs target",
          }}
          icon={TrendingUp}
          iconColor={
            overview.successRate.value >= overview.successRate.target
              ? "text-green-600 bg-green-100 dark:bg-green-900/30"
              : "text-red-600 bg-red-100 dark:bg-red-900/30"
          }
          chart={<MiniChart data={successRateTrend} color={overview.successRate.value >= overview.successRate.target ? "#22C55E" : "#EF4444"} />}
        />

        <MetricCard
          title="Total Transactions"
          value={formatNumber(overview.transactions.total)}
          subtitle={`${formatNumber(overview.transactions.successful)} successful | ${formatNumber(overview.transactions.failed)} failed`}
          icon={CreditCard}
          iconColor="text-blue-600 bg-blue-100 dark:bg-blue-900/30"
          chart={<MiniChart data={transactionsTrend} color="#0066FF" />}
        />

        <MetricCard
          title="Revenue (Fees)"
          value={formatCurrency(overview.revenue.fees)}
          trend={{
            value: 8.3,
            direction: "up",
            label: "vs last week",
          }}
          icon={DollarSign}
          iconColor="text-purple-600 bg-purple-100 dark:bg-purple-900/30"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Active Merchants"
          value={formatNumber(overview.merchants.active)}
          trend={{
            value: overview.merchants.growth,
            direction: "up",
            label: "new this month",
          }}
          icon={Users}
          iconColor="text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30"
        />

        <MetricCard
          title="Avg Processing Time"
          value={formatDuration(overview.processingTime.average)}
          trend={{
            value: -12,
            direction: "down",
            label: "faster than avg",
          }}
          icon={Clock}
          iconColor="text-orange-600 bg-orange-100 dark:bg-orange-900/30"
        />

        <MetricCard
          title="Pending Withdrawals"
          value={formatCurrency(overview.pendingWithdrawals.amount)}
          subtitle={`${overview.pendingWithdrawals.count} withdrawals pending`}
          icon={Wallet}
          iconColor="text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Transactions - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentTransactions transactions={recentTransactions} />
        </div>

        {/* Alerts Summary */}
        <div>
          <AlertsSummary alerts={alerts} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Merchants */}
        <TopMerchants merchants={topMerchants} />

        {/* Payment Methods Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Payment Methods Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentMethodChart data={transactionStats.paymentMethodDistribution} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
