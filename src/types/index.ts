export type TransactionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded"
  | "chargeback";

export type PaymentMethod =
  | "card"
  | "spei"
  | "oxxo"
  | "paypal"
  | "crypto";

export type WithdrawalStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export type MerchantStatus =
  | "active"
  | "suspended"
  | "pending_review";

export type MerchantTier =
  | "starter"
  | "growth"
  | "enterprise";

export type AlertType =
  | "success_rate"
  | "high_chargebacks"
  | "unusual_volume"
  | "system_latency"
  | "fraud_suspected";

export type AlertSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface Transaction {
  _id: string;
  transactionId: string;
  merchantId: string;
  merchantName: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  cardBrand?: string;
  errorCode?: string;
  errorMessage?: string;
  processingTime: number;
  fee: number;
  netAmount: number;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Withdrawal {
  _id: string;
  withdrawalId: string;
  merchantId: string;
  merchantName: string;
  amount: number;
  currency: string;
  status: WithdrawalStatus;
  bankAccount: string;
  bankName: string;
  requestedAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  processedBy?: string;
  notes?: string;
}

export interface Merchant {
  _id: string;
  merchantId: string;
  businessName: string;
  status: MerchantStatus;
  tier: MerchantTier;
  balance: number;
  totalProcessed: number;
  createdAt: Date;
}

export interface Alert {
  _id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  metric: string;
  threshold: number;
  currentValue: number;
  merchantId?: string;
  isRead: boolean;
  isResolved: boolean;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface DashboardOverview {
  tpv: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    changePercent: number;
  };
  successRate: {
    value: number;
    trend: "up" | "down" | "stable";
    target: number;
  };
  transactions: {
    total: number;
    successful: number;
    failed: number;
  };
  revenue: {
    total: number;
    fees: number;
  };
  merchants: {
    active: number;
    growth: number;
  };
  processingTime: {
    average: number;
    trend: "up" | "down" | "stable";
  };
  pendingWithdrawals: {
    count: number;
    amount: number;
  };
}

export interface TransactionStats {
  totalTransactions: number;
  successRate: number;
  averageTicket: number;
  failedBreakdown: Record<string, number>;
  volumeOverTime: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
  successRateTrend: Array<{
    date: string;
    rate: number;
  }>;
  paymentMethodDistribution: Array<{
    method: PaymentMethod;
    count: number;
    percentage: number;
  }>;
  hourlyHeatmap: Array<{
    hour: number;
    day: number;
    count: number;
  }>;
}

export interface RevenueBreakdown {
  byPaymentMethod: Array<{
    method: PaymentMethod;
    revenue: number;
    percentage: number;
  }>;
  byMerchantTier: Array<{
    tier: MerchantTier;
    revenue: number;
    percentage: number;
  }>;
  dailyTrend: Array<{
    date: string;
    revenue: number;
  }>;
  topMerchants: Array<{
    merchantId: string;
    merchantName: string;
    revenue: number;
  }>;
}

export interface AlertThreshold {
  _id: string;
  type: AlertType;
  threshold: number;
  isEnabled: boolean;
  description: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: "coo" | "admin" | "analyst";
  avatar?: string;
}

export interface RealtimeEvent {
  type: "transaction" | "withdrawal" | "alert";
  action: "created" | "updated";
  data: Transaction | Withdrawal | Alert;
  timestamp: Date;
}
