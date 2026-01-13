import mongoose, { Schema, Document, Model } from "mongoose";
import { Merchant as IMerchant, MerchantStatus, MerchantTier } from "@/types";

export interface MerchantDocument extends Omit<IMerchant, "_id">, Document {}

const MerchantSchema = new Schema<MerchantDocument>(
  {
    merchantId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "suspended", "pending_review"] as MerchantStatus[],
      required: true,
      index: true,
    },
    tier: {
      type: String,
      enum: ["starter", "growth", "enterprise"] as MerchantTier[],
      required: true,
      index: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    totalProcessed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
MerchantSchema.index({ status: 1 });
MerchantSchema.index({ tier: 1 });
MerchantSchema.index({ totalProcessed: -1 });

const Merchant: Model<MerchantDocument> =
  mongoose.models.Merchant ||
  mongoose.model<MerchantDocument>("Merchant", MerchantSchema);

export default Merchant;
