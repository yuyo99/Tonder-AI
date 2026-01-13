"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  CreditCard,
  Banknote,
  Store,
  Wallet,
  Bitcoin,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Filter,
  Download,
  Search,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PaymentMethodChart } from "@/components/charts/payment-method-chart";
import {
  mockTransactionStats,
  generateRecentTransactions,
} from "@/lib/mock-data";
import { formatCurrency, formatDuration, formatNumber, formatPercentage } from "@/lib/utils";
import { Transaction, PaymentMethod, TransactionStatus } from "@/types";

const methodIcons: Record<PaymentMethod, React.ComponentType<{ className?: string }>> = {
  card: CreditCard,
  spei: Banknote,
  oxxo: Store,
  paypal: Wallet,
  crypto: Bitcoin,
};

const statusConfig: Record<TransactionStatus, { icon: React.ComponentType<{ className?: string }>; variant: "success" | "danger" | "warning" | "info" | "secondary"; label: string }> = {
  completed: { icon: CheckCircle2, variant: "success", label: "Completed" },
  failed: { icon: XCircle, variant: "danger", label: "Failed" },
  pending: { icon: Clock, variant: "warning", label: "Pending" },
  processing: { icon: Loader2, variant: "info", label: "Processing" },
  refunded: { icon: XCircle, variant: "secondary", label: "Refunded" },
  chargeback: { icon: XCircle, variant: "danger", label: "Chargeback" },
};

export default function TransactionsPage() {
  const [transactions] = useState<Transaction[]>(() =>
    generateRecentTransactions(100)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const stats = mockTransactionStats;

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.merchantName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
      const matchesMethod = methodFilter === "all" || tx.paymentMethod === methodFilter;
      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [transactions, searchQuery, statusFilter, methodFilter]);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Total Transactions"
          value={formatNumber(stats.totalTransactions)}
          icon={CreditCard}
          iconColor="text-blue-600 bg-blue-100 dark:bg-blue-900/30"
        />
        <MetricCard
          title="Success Rate"
          value={formatPercentage(stats.successRate)}
          trend={{
            value: 1.2,
            direction: "up",
            label: "vs last period",
          }}
          icon={TrendingUp}
          iconColor="text-green-600 bg-green-100 dark:bg-green-900/30"
        />
        <MetricCard
          title="Average Ticket"
          value={formatCurrency(stats.averageTicket)}
          icon={BarChart3}
          iconColor="text-purple-600 bg-purple-100 dark:bg-purple-900/30"
        />
        <MetricCard
          title="Failed Transactions"
          value={formatNumber(Object.values(stats.failedBreakdown).reduce((a, b) => a + b, 0))}
          icon={AlertCircle}
          iconColor="text-red-600 bg-red-100 dark:bg-red-900/30"
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="list" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="list">Transaction List</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        <TabsContent value="list" className="space-y-4">
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
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                    <SelectItem value="chargeback">Chargeback</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="spei">SPEI</SelectItem>
                    <SelectItem value="oxxo">OXXO</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="crypto">Crypto</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Processing Time</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredTransactions.slice(0, 20).map((tx, index) => {
                      const MethodIcon = methodIcons[tx.paymentMethod];
                      const status = statusConfig[tx.status];
                      const StatusIcon = status.icon;

                      return (
                        <motion.tr
                          key={tx.transactionId}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedTransaction(tx)}
                        >
                          <TableCell className="font-mono text-sm">
                            {tx.transactionId.slice(0, 18)}...
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{tx.merchantName}</span>
                              {tx.cardBrand && (
                                <Badge variant="outline" className="text-xs">
                                  {tx.cardBrand}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(tx.amount)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MethodIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="capitalize">{tx.paymentMethod}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDuration(tx.processingTime)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDistanceToNow(new Date(tx.createdAt), {
                              addSuffix: true,
                            })}
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Payment Methods Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentMethodChart data={stats.paymentMethodDistribution} />
              </CardContent>
            </Card>

            {/* Failed Transactions Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Failed Transactions by Error</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.failedBreakdown).map(([code, count]) => {
                    const total = Object.values(stats.failedBreakdown).reduce(
                      (a, b) => a + b,
                      0
                    );
                    const percentage = (count / total) * 100;
                    return (
                      <div key={code} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="capitalize">
                            {code.replace(/_/g, " ")}
                          </span>
                          <span className="text-muted-foreground">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Transaction Detail Dialog */}
      <Dialog
        open={!!selectedTransaction}
        onOpenChange={() => setSelectedTransaction(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              {selectedTransaction?.transactionId}
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Merchant</label>
                  <p className="font-medium">{selectedTransaction.merchantName}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Amount</label>
                  <p className="font-medium text-lg">
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge variant={statusConfig[selectedTransaction.status].variant}>
                      {statusConfig[selectedTransaction.status].label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Payment Method
                  </label>
                  <p className="font-medium capitalize">
                    {selectedTransaction.paymentMethod}
                    {selectedTransaction.cardBrand && ` (${selectedTransaction.cardBrand})`}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Fee</label>
                  <p className="font-medium">{formatCurrency(selectedTransaction.fee)}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Net Amount</label>
                  <p className="font-medium">
                    {formatCurrency(selectedTransaction.netAmount)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Processing Time
                  </label>
                  <p className="font-medium">
                    {formatDuration(selectedTransaction.processingTime)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Created At</label>
                  <p className="font-medium">
                    {new Date(selectedTransaction.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {selectedTransaction.errorCode && (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                  <label className="text-sm text-red-600 font-medium">Error</label>
                  <p className="text-sm mt-1">
                    {selectedTransaction.errorCode}: {selectedTransaction.errorMessage}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
