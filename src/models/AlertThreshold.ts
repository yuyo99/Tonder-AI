import mongoose, { Schema, Document, Model } from "mongoose";
import { AlertThreshold as IAlertThreshold, AlertType } from "@/types";

export interface AlertThresholdDocument extends Omit<IAlertThreshold, "_id">, Document {}

const AlertThresholdSchema = new Schema<AlertThresholdDocument>(
  {
    type: {
      type: String,
      enum: ["success_rate", "high_chargebacks", "unusual_volume", "system_latency", "fraud_suspected"] as AlertType[],
      required: true,
      unique: true,
    },
    threshold: {
      type: Number,
      required: true,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AlertThreshold: Model<AlertThresholdDocument> =
  mongoose.models.AlertThreshold ||
  mongoose.model<AlertThresholdDocument>("AlertThreshold", AlertThresholdSchema);

export default AlertThreshold;
