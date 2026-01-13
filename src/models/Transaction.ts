import mongoose, { Schema, Document, Model } from "mongoose";
import { Transaction as ITransaction, TransactionStatus, PaymentMethod } from "@/types";

export interface TransactionDocument extends Omit<ITransaction, "_id">, Document {}

const TransactionSchema = new Schema<TransactionDocument>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    merchantId: {
      type: String,
      required: true,
      index: true,
    },
    merchantName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "MXN",
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "refunded", "chargeback"] as TransactionStatus[],
      required: true,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "spei", "oxxo", "paypal", "crypto"] as PaymentMethod[],
      required: true,
      index: true,
    },
    cardBrand: {
      type: String,
    },
    errorCode: {
      type: String,
    },
    errorMessage: {
      type: String,
    },
    processingTime: {
      type: Number,
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
    netAmount: {
      type: Number,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
TransactionSchema.index({ createdAt: -1 });
TransactionSchema.index({ merchantId: 1, createdAt: -1 });
TransactionSchema.index({ status: 1, createdAt: -1 });
TransactionSchema.index({ paymentMethod: 1, createdAt: -1 });

const Transaction: Model<TransactionDocument> =
  mongoose.models.Transaction ||
  mongoose.model<TransactionDocument>("Transaction", TransactionSchema);

export default Transaction;
