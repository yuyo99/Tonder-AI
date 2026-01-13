import mongoose, { Schema, Document, Model } from "mongoose";
import { Alert as IAlert, AlertType, AlertSeverity } from "@/types";

export interface AlertDocument extends Omit<IAlert, "_id">, Document {}

const AlertSchema = new Schema<AlertDocument>(
  {
    type: {
      type: String,
      enum: ["success_rate", "high_chargebacks", "unusual_volume", "system_latency", "fraud_suspected"] as AlertType[],
      required: true,
      index: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"] as AlertSeverity[],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    metric: {
      type: String,
      required: true,
    },
    threshold: {
      type: Number,
      required: true,
    },
    currentValue: {
      type: Number,
      required: true,
    },
    merchantId: {
      type: String,
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    isResolved: {
      type: Boolean,
      default: false,
      index: true,
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
AlertSchema.index({ isResolved: 1, severity: -1, createdAt: -1 });
AlertSchema.index({ isRead: 1, createdAt: -1 });

const Alert: Model<AlertDocument> =
  mongoose.models.Alert ||
  mongoose.model<AlertDocument>("Alert", AlertSchema);

export default Alert;
