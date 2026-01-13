"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Transaction } from "@/types";
import { formatCurrency, formatDuration } from "@/lib/utils";
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
} from "lucide-react";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const methodIcons = {
  card: CreditCard,
  spei: Banknote,
  oxxo: Store,
  paypal: Wallet,
  crypto: Bitcoin,
};

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    variant: "success" as const,
    label: "Completed",
  },
  failed: {
    icon: XCircle,
    variant: "danger" as const,
    label: "Failed",
  },
  pending: {
    icon: Clock,
    variant: "warning" as const,
    label: "Pending",
  },
  processing: {
    icon: Loader2,
    variant: "info" as const,
    label: "Processing",
  },
  refunded: {
    icon: XCircle,
    variant: "secondary" as const,
    label: "Refunded",
  },
  chargeback: {
    icon: XCircle,
    variant: "danger" as const,
    label: "Chargeback",
  },
};

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Recent Transactions</span>
          <Badge variant="secondary" className="font-normal">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <AnimatePresence initial={false}>
            {transactions.map((transaction, index) => {
              const MethodIcon = methodIcons[transaction.paymentMethod];
              const status = statusConfig[transaction.status];
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={transaction.transactionId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex items-center gap-4 py-3 border-b last:border-0"
                >
                  {/* Method Icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                    <MethodIcon className="h-5 w-5 text-muted-foreground" />
                  </div>

                  {/* Transaction Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">
                        {transaction.merchantName}
                      </span>
                      {transaction.cardBrand && (
                        <Badge variant="outline" className="text-xs">
                          {transaction.cardBrand}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono">
                        {transaction.transactionId.slice(0, 15)}...
                      </span>
                      <span>
                        {formatDistanceToNow(new Date(transaction.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Amount & Status */}
                  <div className="text-right">
                    <div className="font-semibold">
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      <Badge variant={status.variant} className="text-xs">
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
