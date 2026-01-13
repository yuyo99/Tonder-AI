import mongoose, { Schema, Document, Model } from "mongoose";
import { Withdrawal as IWithdrawal, WithdrawalStatus } from "@/types";

export interface WithdrawalDocument extends Omit<IWithdrawal, "_id">, Document {}

const WithdrawalSchema = new Schema<WithdrawalDocument>(
  {
    withdrawalId: {
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
      enum: ["pending", "processing", "completed", "failed", "cancelled"] as WithdrawalStatus[],
      required: true,
      index: true,
    },
    bankAccount: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    requestedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    processedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    processedBy: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
WithdrawalSchema.index({ requestedAt: -1 });
WithdrawalSchema.index({ status: 1, requestedAt: -1 });
WithdrawalSchema.index({ merchantId: 1, requestedAt: -1 });

const Withdrawal: Model<WithdrawalDocument> =
  mongoose.models.Withdrawal ||
  mongoose.model<WithdrawalDocument>("Withdrawal", WithdrawalSchema);

export default Withdrawal;
