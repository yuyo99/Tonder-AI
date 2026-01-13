"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Search,
  Download,
  RefreshCw,
  Building2,
  ArrowRight,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricCard } from "@/components/dashboard/metric-card";
import { generatePendingWithdrawals, mockMerchants } from "@/lib/mock-data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Withdrawal, WithdrawalStatus } from "@/types";

const statusConfig: Record<WithdrawalStatus, { icon: React.ComponentType<{ className?: string }>; variant: "success" | "danger" | "warning" | "info" | "secondary"; label: string; color: string }> = {
  completed: { icon: CheckCircle2, variant: "success", label: "Completed", color: "bg-green-500" },
  processing: { icon: Loader2, variant: "info", label: "Processing", color: "bg-blue-500" },
  pending: { icon: Clock, variant: "warning", label: "Pending", color: "bg-yellow-500" },
  failed: { icon: XCircle, variant: "danger", label: "Failed", color: "bg-red-500" },
  cancelled: { icon: XCircle, variant: "secondary", label: "Cancelled", color: "bg-gray-500" },
};

// Generate more withdrawals for the page
function generateWithdrawals(count: number): Withdrawal[] {
  const banks = ["BBVA", "Santander", "Banorte", "HSBC", "Citibanamex", "Scotiabank"];
  const statuses: WithdrawalStatus[] = ["pending", "pending", "processing", "completed", "completed", "completed", "failed", "cancelled"];

  return Array.from({ length: count }, (_, i) => {
    const merchant = mockMerchants[Math.floor(Math.random() * mockMerchants.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const requestedAt = new Date(Date.now() - i * 3600000 * Math.random() * 48);

    return {
      _id: `wdl-${i}`,
      withdrawalId: `WDL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}${i}`,
      merchantId: merchant.merchantId,
      merchantName: merchant.businessName,
      amount: Math.floor(Math.random() * 500000) + 10000,
      currency: "MXN",
      status,
      bankAccount: `****${Math.floor(1000 + Math.random() * 9000)}`,
      bankName: banks[Math.floor(Math.random() * banks.length)],
      requestedAt,
      processedAt: status !== "pending" ? new Date(requestedAt.getTime() + Math.random() * 86400000) : undefined,
      completedAt: status === "completed" ? new Date(requestedAt.getTime() + Math.random() * 172800000) : undefined,
    };
  });
}

export default function WithdrawalsPage() {
  const [withdrawals] = useState<Withdrawal[]>(() => generateWithdrawals(50));
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Calculate stats
  const stats = useMemo(() => {
    const pending = withdrawals.filter((w) => w.status === "pending");
    const processing = withdrawals.filter((w) => w.status === "processing");
    const completedToday = withdrawals.filter(
      (w) =>
        w.status === "completed" &&
        new Date(w.completedAt!).toDateString() === new Date().toDateString()
    );

    return {
      pendingCount: pending.length,
      pendingAmount: pending.reduce((acc, w) => acc + w.amount, 0),
      processingCount: processing.length,
      processingAmount: processing.reduce((acc, w) => acc + w.amount, 0),
      completedTodayCount: completedToday.length,
      completedTodayAmount: completedToday.reduce((acc, w) => acc + w.amount, 0),
    };
  }, [withdrawals]);

  const filteredWithdrawals = useMemo(() => {
    return withdrawals.filter((w) => {
      const matchesSearch =
        w.withdrawalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.merchantName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || w.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [withdrawals, searchQuery, statusFilter]);

  const pendingWithdrawals = filteredWithdrawals.filter(
    (w) => w.status === "pending" || w.status === "processing"
  );

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Pending Amount"
          value={formatCurrency(stats.pendingAmount)}
          subtitle={`${stats.pendingCount} withdrawals pending`}
          icon={Clock}
          iconColor="text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30"
        />
        <MetricCard
          title="Processing"
          value={formatCurrency(stats.processingAmount)}
          subtitle={`${stats.processingCount} in progress`}
          icon={Loader2}
          iconColor="text-blue-600 bg-blue-100 dark:bg-blue-900/30"
        />
        <MetricCard
          title="Completed Today"
          value={formatCurrency(stats.completedTodayAmount)}
          subtitle={`${stats.completedTodayCount} processed`}
          icon={CheckCircle2}
          iconColor="text-green-600 bg-green-100 dark:bg-green-900/30"
        />
        <MetricCard
          title="Avg Processing Time"
          value="4.2 hrs"
          trend={{
            value: -15,
            direction: "down",
            label: "faster",
          }}
          icon={AlertCircle}
          iconColor="text-purple-600 bg-purple-100 dark:bg-purple-900/30"
        />
      </div>

      {/* Processing Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Withdrawal Processing Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {/* Pending */}
            <div className="flex flex-col items-center flex-1">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <span className="mt-2 font-medium">Pending</span>
              <span className="text-2xl font-bold">{stats.pendingCount}</span>
              <span className="text-sm text-muted-foreground">
                {formatCurrency(stats.pendingAmount)}
              </span>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            {/* Processing */}
            <div className="flex flex-col items-center flex-1">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <span className="mt-2 font-medium">Processing</span>
              <span className="text-2xl font-bold">{stats.processingCount}</span>
              <span className="text-sm text-muted-foreground">
                {formatCurrency(stats.processingAmount)}
              </span>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            {/* Completed */}
            <div className="flex flex-col items-center flex-1">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <span className="mt-2 font-medium">Completed</span>
              <span className="text-2xl font-bold">{stats.completedTodayCount}</span>
              <span className="text-sm text-muted-foreground">today</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="pending" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Queue ({pendingWithdrawals.length})
            </TabsTrigger>
            <TabsTrigger value="all">All Withdrawals</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <TabsContent value="pending" className="space-y-4">
          {/* Pending Queue */}
          <div className="grid gap-4">
            <AnimatePresence>
              {pendingWithdrawals.slice(0, 10).map((withdrawal, index) => {
                const status = statusConfig[withdrawal.status];
                const StatusIcon = status.icon;

                return (
                  <motion.div
                    key={withdrawal.withdrawalId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Building2 className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{withdrawal.merchantName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {withdrawal.bankName} - {withdrawal.bankAccount}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold">
                                  {formatCurrency(withdrawal.amount)}
                                </p>
                                <Badge variant={status.variant}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {status.label}
                                </Badge>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                              <span>
                                Requested{" "}
                                {formatDistanceToNow(new Date(withdrawal.requestedAt), {
                                  addSuffix: true,
                                })}
                              </span>
                              <span className="font-mono">{withdrawal.withdrawalId}</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Process
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by ID or merchant..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Withdrawals Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Withdrawal ID</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Bank</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWithdrawals.slice(0, 20).map((withdrawal) => {
                    const status = statusConfig[withdrawal.status];
                    const StatusIcon = status.icon;

                    return (
                      <TableRow key={withdrawal.withdrawalId}>
                        <TableCell className="font-mono text-sm">
                          {withdrawal.withdrawalId.slice(0, 18)}...
                        </TableCell>
                        <TableCell className="font-medium">
                          {withdrawal.merchantName}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(withdrawal.amount)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{withdrawal.bankName}</p>
                            <p className="text-xs text-muted-foreground">
                              {withdrawal.bankAccount}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDistanceToNow(new Date(withdrawal.requestedAt), {
                            addSuffix: true,
                          })}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
