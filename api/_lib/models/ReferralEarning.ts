import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReferralEarning extends Document {
  referrerId: mongoose.Types.ObjectId;
  refereeId: mongoose.Types.ObjectId;
  refereeEmail: string;
  orderId: string;
  transactionAmount: number;
  commissionPercent: number;
  commissionAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReferralEarningSchema: Schema<IReferralEarning> = new Schema({
  referrerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  refereeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  refereeEmail: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  transactionAmount: {
    type: Number,
    required: true,
  },
  commissionPercent: {
    type: Number,
    required: true,
  },
  commissionAmount: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const ReferralEarning = (mongoose.models.ReferralEarning as Model<IReferralEarning>) || mongoose.model<IReferralEarning>('ReferralEarning', ReferralEarningSchema);

export default ReferralEarning;
