import {
  Transaction,
  Withdrawal,
  Merchant,
  Alert,
  DashboardOverview,
  TransactionStats,
  RevenueBreakdown,
  PaymentMethod,
  MerchantTier,
} from "@/types";

// Generate mock transaction ID
function generateTxnId(): string {
  return `TXN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

// Generate mock withdrawal ID
function generateWdlId(): string {
  return `WDL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

// Mock merchants
export const mockMerchants: Merchant[] = [
  {
    _id: "m1",
    merchantId: "MERCH-001",
    businessName: "TechMart Mexico",
    status: "active",
    tier: "enterprise",
    balance: 1250000,
    totalProcessed: 45000000,
    createdAt: new Date("2023-01-15"),
  },
  {
    _id: "m2",
    merchantId: "MERCH-002",
    businessName: "Fashion Hub",
    status: "active",
    tier: "growth",
    balance: 450000,
    totalProcessed: 12000000,
    createdAt: new Date("2023-03-20"),
  },
  {
    _id: "m3",
    merchantId: "MERCH-003",
    businessName: "Gourmet Delights",
    status: "active",
    tier: "growth",
    balance: 320000,
    totalProcessed: 8500000,
    createdAt: new Date("2023-05-10"),
  },
  {
    _id: "m4",
    merchantId: "MERCH-004",
    businessName: "AutoParts Express",
    status: "active",
    tier: "enterprise",
    balance: 890000,
    totalProcessed: 32000000,
    createdAt: new Date("2022-11-05"),
  },
  {
    _id: "m5",
    merchantId: "MERCH-005",
    businessName: "Digital Services MX",
    status: "active",
    tier: "starter",
    balance: 75000,
    totalProcessed: 1500000,
    createdAt: new Date("2024-01-10"),
  },
];

// Generate recent transactions
export function generateRecentTransactions(count: number = 10): Transaction[] {
  const statuses: Transaction["status"][] = ["completed", "completed", "completed", "completed", "completed", "failed", "pending", "processing"];
  const methods: PaymentMethod[] = ["card", "card", "card", "spei", "spei", "oxxo", "paypal", "crypto"];
  const cardBrands = ["Visa", "Mastercard", "Amex", "Visa", "Mastercard"];
  const errorCodes = ["insufficient_funds", "card_declined", "expired_card", "fraud_suspected", "network_error"];

  return Array.from({ length: count }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const method = methods[Math.floor(Math.random() * methods.length)];
    const merchant = mockMerchants[Math.floor(Math.random() * mockMerchants.length)];
    const amount = Math.floor(Math.random() * 50000) + 100;
    const fee = amount * 0.029;
    const createdAt = new Date(Date.now() - i * 60000 * Math.random() * 5);

    const transaction: Transaction = {
      _id: `txn-${i}`,
      transactionId: generateTxnId(),
      merchantId: merchant.merchantId,
      merchantName: merchant.businessName,
      amount,
      currency: "MXN",
      status,
      paymentMethod: method,
      processingTime: Math.floor(Math.random() * 2000) + 200,
      fee,
      netAmount: amount - fee,
      createdAt,
      updatedAt: createdAt,
    };

    if (method === "card") {
      transaction.cardBrand = cardBrands[Math.floor(Math.random() * cardBrands.length)];
    }

    if (status === "failed") {
      const errorCode = errorCodes[Math.floor(Math.random() * errorCodes.length)];
      transaction.errorCode = errorCode;
      transaction.errorMessage = errorCode.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    }

    if (status === "completed") {
      transaction.completedAt = new Date(createdAt.getTime() + transaction.processingTime);
    }

    return transaction;
  });
}

// Generate pending withdrawals
export function generatePendingWithdrawals(count: number = 5): Withdrawal[] {
  const banks = ["BBVA", "Santander", "Banorte", "HSBC", "Citibanamex"];
  const statuses: Withdrawal["status"][] = ["pending", "pending", "pending", "processing", "processing"];

  return Array.from({ length: count }, (_, i) => {
    const merchant = mockMerchants[Math.floor(Math.random() * mockMerchants.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const requestedAt = new Date(Date.now() - i * 3600000 * Math.random() * 24);

    return {
      _id: `wdl-${i}`,
      withdrawalId: generateWdlId(),
      merchantId: merchant.merchantId,
      merchantName: merchant.businessName,
      amount: Math.floor(Math.random() * 500000) + 10000,
      currency: "MXN",
      status,
      bankAccount: `****${Math.floor(1000 + Math.random() * 9000)}`,
      bankName: banks[Math.floor(Math.random() * banks.length)],
      requestedAt,
    };
  });
}

// Generate alerts
export function generateAlerts(count: number = 5): Alert[] {
  const alertTypes: Alert["type"][] = ["success_rate", "high_chargebacks", "unusual_volume", "system_latency", "fraud_suspected"];
  const severities: Alert["severity"][] = ["low", "medium", "high", "critical"];

  const alertTemplates = [
    {
      type: "success_rate" as const,
      title: "Success Rate Below Threshold",
      message: "Transaction success rate has dropped below the 95% threshold",
      metric: "success_rate",
      threshold: 95,
    },
    {
      type: "high_chargebacks" as const,
      title: "High Chargeback Rate",
      message: "Chargeback rate has exceeded the 1% threshold for merchant",
      metric: "chargeback_rate",
      threshold: 1,
    },
    {
      type: "unusual_volume" as const,
      title: "Unusual Transaction Volume",
      message: "Transaction volume is 50% above the daily average",
      metric: "volume_change",
      threshold: 50,
    },
    {
      type: "system_latency" as const,
      title: "High System Latency",
      message: "Average processing time has exceeded 3000ms threshold",
      metric: "processing_time",
      threshold: 3000,
    },
    {
      type: "fraud_suspected" as const,
      title: "Potential Fraud Detected",
      message: "Multiple suspicious transactions detected from single IP",
      metric: "fraud_score",
      threshold: 80,
    },
  ];

  return Array.from({ length: count }, (_, i) => {
    const template = alertTemplates[i % alertTemplates.length];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const merchant = mockMerchants[Math.floor(Math.random() * mockMerchants.length)];

    return {
      _id: `alert-${i}`,
      type: template.type,
      severity,
      title: template.title,
      message: template.message,
      metric: template.metric,
      threshold: template.threshold,
      currentValue: template.threshold * (0.8 + Math.random() * 0.4),
      merchantId: Math.random() > 0.5 ? merchant.merchantId : undefined,
      isRead: Math.random() > 0.6,
      isResolved: false,
      createdAt: new Date(Date.now() - i * 3600000 * Math.random() * 12),
    };
  });
}

// Dashboard overview data
export const mockDashboardOverview: DashboardOverview = {
  tpv: {
    today: 8456000,
    thisWeek: 45230000,
    thisMonth: 178500000,
    changePercent: 12.5,
  },
  successRate: {
    value: 96.8,
    trend: "up",
    target: 95,
  },
  transactions: {
    total: 15234,
    successful: 14746,
    failed: 488,
  },
  revenue: {
    total: 5175000,
    fees: 5175000,
  },
  merchants: {
    active: 342,
    growth: 8,
  },
  processingTime: {
    average: 847,
    trend: "down",
  },
  pendingWithdrawals: {
    count: 23,
    amount: 4560000,
  },
};

// Transaction stats
export const mockTransactionStats: TransactionStats = {
  totalTransactions: 15234,
  successRate: 96.8,
  averageTicket: 555.23,
  failedBreakdown: {
    insufficient_funds: 156,
    card_declined: 134,
    expired_card: 89,
    fraud_suspected: 67,
    network_error: 42,
  },
  volumeOverTime: Array.from({ length: 24 }, (_, i) => ({
    date: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
    count: Math.floor(Math.random() * 500) + 200,
    amount: Math.floor(Math.random() * 500000) + 100000,
  })),
  successRateTrend: Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split("T")[0],
    rate: 94 + Math.random() * 4,
  })),
  paymentMethodDistribution: [
    { method: "card", count: 9140, percentage: 60 },
    { method: "spei", count: 3047, percentage: 20 },
    { method: "oxxo", count: 1523, percentage: 10 },
    { method: "paypal", count: 1066, percentage: 7 },
    { method: "crypto", count: 458, percentage: 3 },
  ],
  hourlyHeatmap: Array.from({ length: 168 }, (_, i) => ({
    hour: i % 24,
    day: Math.floor(i / 24),
    count: Math.floor(Math.random() * 100) + 10,
  })),
};

// Revenue breakdown
export const mockRevenueBreakdown: RevenueBreakdown = {
  byPaymentMethod: [
    { method: "card", revenue: 3105000, percentage: 60 },
    { method: "spei", revenue: 1035000, percentage: 20 },
    { method: "oxxo", revenue: 517500, percentage: 10 },
    { method: "paypal", revenue: 362250, percentage: 7 },
    { method: "crypto", revenue: 155250, percentage: 3 },
  ],
  byMerchantTier: [
    { tier: "enterprise", revenue: 3105000, percentage: 60 },
    { tier: "growth", revenue: 1552500, percentage: 30 },
    { tier: "starter", revenue: 517500, percentage: 10 },
  ],
  dailyTrend: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split("T")[0],
    revenue: Math.floor(Math.random() * 200000) + 150000,
  })),
  topMerchants: mockMerchants.slice(0, 5).map((m) => ({
    merchantId: m.merchantId,
    merchantName: m.businessName,
    revenue: Math.floor(Math.random() * 500000) + 100000,
  })),
};

// Top merchants by volume today
export function getTopMerchantsByVolume(): Array<{
  merchantId: string;
  merchantName: string;
  volume: number;
  transactions: number;
}> {
  return mockMerchants.map((m) => ({
    merchantId: m.merchantId,
    merchantName: m.businessName,
    volume: Math.floor(Math.random() * 2000000) + 500000,
    transactions: Math.floor(Math.random() * 1000) + 200,
  })).sort((a, b) => b.volume - a.volume);
}

// 24-hour trend data for mini charts
export function get24HourTrend(metric: "volume" | "transactions" | "successRate"): Array<{ hour: string; value: number }> {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(Date.now() - (23 - i) * 3600000);
    let value: number;

    switch (metric) {
      case "volume":
        value = Math.floor(Math.random() * 500000) + 200000;
        break;
      case "transactions":
        value = Math.floor(Math.random() * 500) + 200;
        break;
      case "successRate":
        value = 94 + Math.random() * 4;
        break;
    }

    return {
      hour: hour.toLocaleTimeString("en-US", { hour: "2-digit", hour12: false }),
      value,
    };
  });
}
