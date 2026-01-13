import mongoose from "mongoose";
import { Transaction, Withdrawal, Merchant, Alert, AlertThreshold } from "../src/models";
import type { PaymentMethod, TransactionStatus, WithdrawalStatus, MerchantStatus, MerchantTier, AlertType, AlertSeverity } from "../src/types";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/tonder-analytics";

// Merchant data
const merchantsData: Array<{
  merchantId: string;
  businessName: string;
  status: MerchantStatus;
  tier: MerchantTier;
}> = [
  { merchantId: "MERCH-001", businessName: "TechMart Mexico", status: "active", tier: "enterprise" },
  { merchantId: "MERCH-002", businessName: "Fashion Hub", status: "active", tier: "growth" },
  { merchantId: "MERCH-003", businessName: "Gourmet Delights", status: "active", tier: "growth" },
  { merchantId: "MERCH-004", businessName: "AutoParts Express", status: "active", tier: "enterprise" },
  { merchantId: "MERCH-005", businessName: "Digital Services MX", status: "active", tier: "starter" },
  { merchantId: "MERCH-006", businessName: "HomeStyle Furniture", status: "active", tier: "growth" },
  { merchantId: "MERCH-007", businessName: "SportZone", status: "active", tier: "enterprise" },
  { merchantId: "MERCH-008", businessName: "PetLove Store", status: "active", tier: "starter" },
  { merchantId: "MERCH-009", businessName: "ElectroWorld", status: "active", tier: "enterprise" },
  { merchantId: "MERCH-010", businessName: "Beauty Palace", status: "active", tier: "growth" },
  { merchantId: "MERCH-011", businessName: "BookHaven", status: "active", tier: "starter" },
  { merchantId: "MERCH-012", businessName: "Toy Kingdom", status: "active", tier: "growth" },
  { merchantId: "MERCH-013", businessName: "Garden Center MX", status: "active", tier: "starter" },
  { merchantId: "MERCH-014", businessName: "Music World", status: "active", tier: "starter" },
  { merchantId: "MERCH-015", businessName: "Jewelry Box", status: "active", tier: "growth" },
  { merchantId: "MERCH-016", businessName: "Travel Adventures", status: "active", tier: "enterprise" },
  { merchantId: "MERCH-017", businessName: "Health Plus", status: "active", tier: "growth" },
  { merchantId: "MERCH-018", businessName: "Office Supplies Co", status: "active", tier: "starter" },
  { merchantId: "MERCH-019", businessName: "Art Gallery MX", status: "pending_review", tier: "starter" },
  { merchantId: "MERCH-020", businessName: "Wine Cellar", status: "active", tier: "growth" },
  { merchantId: "MERCH-021", businessName: "Coffee Roasters", status: "active", tier: "starter" },
  { merchantId: "MERCH-022", businessName: "Tech Solutions Pro", status: "active", tier: "enterprise" },
  { merchantId: "MERCH-023", businessName: "Outdoor Gear", status: "active", tier: "growth" },
  { merchantId: "MERCH-024", businessName: "Kitchen World", status: "suspended", tier: "starter" },
  { merchantId: "MERCH-025", businessName: "Fitness Center", status: "active", tier: "growth" },
  { merchantId: "MERCH-026", businessName: "Baby Store", status: "active", tier: "starter" },
  { merchantId: "MERCH-027", businessName: "Photography Studio", status: "active", tier: "starter" },
  { merchantId: "MERCH-028", businessName: "Luxury Watches", status: "active", tier: "enterprise" },
  { merchantId: "MERCH-029", businessName: "Organic Market", status: "active", tier: "growth" },
  { merchantId: "MERCH-030", businessName: "Gaming Zone", status: "active", tier: "enterprise" },
  { merchantId: "MERCH-031", businessName: "Shoe Palace", status: "active", tier: "growth" },
  { merchantId: "MERCH-032", businessName: "Pharmacy Plus", status: "active", tier: "starter" },
  { merchantId: "MERCH-033", businessName: "Car Rental MX", status: "active", tier: "enterprise" },
  { merchantId: "MERCH-034", businessName: "Event Planning", status: "active", tier: "growth" },
  { merchantId: "MERCH-035", businessName: "Flower Shop", status: "active", tier: "starter" },
  { merchantId: "MERCH-036", businessName: "Restaurant Chain", status: "active", tier: "enterprise" },
  { merchantId: "MERCH-037", businessName: "Bakery Delights", status: "active", tier: "starter" },
  { merchantId: "MERCH-038", businessName: "Hardware Store", status: "active", tier: "growth" },
  { merchantId: "MERCH-039", businessName: "Spa Wellness", status: "active", tier: "growth" },
  { merchantId: "MERCH-040", businessName: "Eyewear Central", status: "active", tier: "starter" },
  { merchantId: "MERCH-041", businessName: "Music Academy", status: "active", tier: "starter" },
  { merchantId: "MERCH-042", businessName: "Dance Studio", status: "active", tier: "starter" },
  { merchantId: "MERCH-043", businessName: "Dental Clinic", status: "active", tier: "growth" },
  { merchantId: "MERCH-044", businessName: "Legal Services", status: "active", tier: "enterprise" },
  { merchantId: "MERCH-045", businessName: "Insurance Agency", status: "active", tier: "enterprise" },
  { merchantId: "MERCH-046", businessName: "Real Estate Pro", status: "active", tier: "enterprise" },
  { merchantId: "MERCH-047", businessName: "Cleaning Services", status: "active", tier: "starter" },
  { merchantId: "MERCH-048", businessName: "Catering Co", status: "active", tier: "growth" },
  { merchantId: "MERCH-049", businessName: "Print Shop", status: "active", tier: "starter" },
  { merchantId: "MERCH-050", businessName: "Moving Company", status: "active", tier: "growth" },
];

const banks = ["BBVA", "Santander", "Banorte", "HSBC", "Citibanamex", "Scotiabank", "Inbursa", "BanRegio"];
const cardBrands = ["Visa", "Mastercard", "Amex"];
const errorCodes = ["insufficient_funds", "card_declined", "expired_card", "fraud_suspected", "network_error", "invalid_card", "processing_error"];
const paymentMethods: PaymentMethod[] = ["card", "spei", "oxxo", "paypal", "crypto"];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTransactionId(): string {
  return `TXN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

function generateWithdrawalId(): string {
  return `WDL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  // Clear existing data
  console.log("Clearing existing data...");
  await Promise.all([
    Transaction.deleteMany({}),
    Withdrawal.deleteMany({}),
    Merchant.deleteMany({}),
    Alert.deleteMany({}),
    AlertThreshold.deleteMany({}),
  ]);

  // Create merchants
  console.log("Creating merchants...");
  const merchants = await Merchant.insertMany(
    merchantsData.map((m) => ({
      ...m,
      balance: randomInt(10000, 2000000),
      totalProcessed: randomInt(500000, 50000000),
      createdAt: new Date(Date.now() - randomInt(30, 365) * 24 * 60 * 60 * 1000),
    }))
  );
  console.log(`Created ${merchants.length} merchants`);

  // Create transactions (1000+)
  console.log("Creating transactions...");
  const transactionsData = [];
  const now = Date.now();

  for (let i = 0; i < 1500; i++) {
    const merchant = randomChoice(merchants);
    const method = randomChoice(paymentMethods);
    const status: TransactionStatus = Math.random() > 0.05
      ? (Math.random() > 0.02 ? "completed" : "pending")
      : (Math.random() > 0.3 ? "failed" : (Math.random() > 0.5 ? "refunded" : "chargeback"));

    const amount = randomInt(50, 50000);
    const feePercent = method === "card" ? 0.029 : method === "spei" ? 0.015 : method === "oxxo" ? 0.035 : 0.025;
    const fee = Math.round(amount * feePercent * 100) / 100;
    const processingTime = randomInt(200, 3500);
    const createdAt = new Date(now - randomInt(0, 30 * 24 * 60 * 60 * 1000));

    const transaction: Record<string, unknown> = {
      transactionId: generateTransactionId() + i,
      merchantId: merchant.merchantId,
      merchantName: merchant.businessName,
      amount,
      currency: "MXN",
      status,
      paymentMethod: method,
      processingTime,
      fee,
      netAmount: amount - fee,
      createdAt,
      updatedAt: createdAt,
    };

    if (method === "card") {
      transaction.cardBrand = randomChoice(cardBrands);
    }

    if (status === "failed") {
      transaction.errorCode = randomChoice(errorCodes);
      transaction.errorMessage = (transaction.errorCode as string).replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
    }

    if (status === "completed") {
      transaction.completedAt = new Date(createdAt.getTime() + processingTime);
    }

    transactionsData.push(transaction);
  }

  await Transaction.insertMany(transactionsData);
  console.log(`Created ${transactionsData.length} transactions`);

  // Create withdrawals
  console.log("Creating withdrawals...");
  const withdrawalsData = [];

  for (let i = 0; i < 100; i++) {
    const merchant = randomChoice(merchants);
    const status: WithdrawalStatus = randomChoice(["pending", "pending", "processing", "completed", "completed", "completed", "failed", "cancelled"]);
    const requestedAt = new Date(now - randomInt(0, 14 * 24 * 60 * 60 * 1000));

    const withdrawal: Record<string, unknown> = {
      withdrawalId: generateWithdrawalId() + i,
      merchantId: merchant.merchantId,
      merchantName: merchant.businessName,
      amount: randomInt(5000, 1000000),
      currency: "MXN",
      status,
      bankAccount: `****${randomInt(1000, 9999)}`,
      bankName: randomChoice(banks),
      requestedAt,
    };

    if (status === "processing" || status === "completed" || status === "failed") {
      withdrawal.processedAt = new Date(requestedAt.getTime() + randomInt(1, 24) * 60 * 60 * 1000);
    }

    if (status === "completed") {
      withdrawal.completedAt = new Date((withdrawal.processedAt as Date).getTime() + randomInt(1, 48) * 60 * 60 * 1000);
    }

    withdrawalsData.push(withdrawal);
  }

  await Withdrawal.insertMany(withdrawalsData);
  console.log(`Created ${withdrawalsData.length} withdrawals`);

  // Create alerts
  console.log("Creating alerts...");
  const alertTypes: AlertType[] = ["success_rate", "high_chargebacks", "unusual_volume", "system_latency", "fraud_suspected"];
  const severities: AlertSeverity[] = ["low", "medium", "high", "critical"];

  const alertTemplates = [
    {
      type: "success_rate" as AlertType,
      title: "Success Rate Below Threshold",
      message: "Transaction success rate has dropped below the 95% threshold",
      metric: "success_rate",
      threshold: 95,
    },
    {
      type: "high_chargebacks" as AlertType,
      title: "High Chargeback Rate",
      message: "Chargeback rate has exceeded the 1% threshold",
      metric: "chargeback_rate",
      threshold: 1,
    },
    {
      type: "unusual_volume" as AlertType,
      title: "Unusual Transaction Volume",
      message: "Transaction volume is significantly different from the daily average",
      metric: "volume_change",
      threshold: 50,
    },
    {
      type: "system_latency" as AlertType,
      title: "High System Latency",
      message: "Average processing time has exceeded threshold",
      metric: "processing_time",
      threshold: 3000,
    },
    {
      type: "fraud_suspected" as AlertType,
      title: "Potential Fraud Detected",
      message: "Suspicious transaction patterns detected",
      metric: "fraud_score",
      threshold: 80,
    },
  ];

  const alertsData = [];
  for (let i = 0; i < 25; i++) {
    const template = randomChoice(alertTemplates);
    const severity = randomChoice(severities);
    const merchant = randomChoice(merchants);
    const createdAt = new Date(now - randomInt(0, 7 * 24 * 60 * 60 * 1000));
    const isResolved = Math.random() > 0.4;

    alertsData.push({
      type: template.type,
      severity,
      title: template.title,
      message: template.message + (Math.random() > 0.5 ? ` for ${merchant.businessName}` : ""),
      metric: template.metric,
      threshold: template.threshold,
      currentValue: template.threshold * (0.7 + Math.random() * 0.6),
      merchantId: Math.random() > 0.5 ? merchant.merchantId : undefined,
      isRead: Math.random() > 0.3,
      isResolved,
      createdAt,
      resolvedAt: isResolved ? new Date(createdAt.getTime() + randomInt(1, 48) * 60 * 60 * 1000) : undefined,
    });
  }

  await Alert.insertMany(alertsData);
  console.log(`Created ${alertsData.length} alerts`);

  // Create alert thresholds
  console.log("Creating alert thresholds...");
  const thresholds = [
    { type: "success_rate" as AlertType, threshold: 95, isEnabled: true, description: "Alert when success rate drops below threshold percentage" },
    { type: "high_chargebacks" as AlertType, threshold: 1, isEnabled: true, description: "Alert when chargeback rate exceeds threshold percentage" },
    { type: "unusual_volume" as AlertType, threshold: 50, isEnabled: true, description: "Alert when volume changes by more than threshold percentage from average" },
    { type: "system_latency" as AlertType, threshold: 3000, isEnabled: true, description: "Alert when average processing time exceeds threshold milliseconds" },
    { type: "fraud_suspected" as AlertType, threshold: 80, isEnabled: true, description: "Alert when fraud score exceeds threshold" },
  ];

  await AlertThreshold.insertMany(thresholds);
  console.log(`Created ${thresholds.length} alert thresholds`);

  console.log("\nSeed completed successfully!");
  console.log("Summary:");
  console.log(`  - Merchants: ${merchants.length}`);
  console.log(`  - Transactions: ${transactionsData.length}`);
  console.log(`  - Withdrawals: ${withdrawalsData.length}`);
  console.log(`  - Alerts: ${alertsData.length}`);
  console.log(`  - Alert Thresholds: ${thresholds.length}`);

  await mongoose.disconnect();
  console.log("\nDisconnected from MongoDB");
}

seed().catch((error) => {
  console.error("Seed error:", error);
  process.exit(1);
});
