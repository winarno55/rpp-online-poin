import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWithdrawal extends Document {
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  status: 'PENDING' | 'PAID' | 'REJECTED';
  adminNote?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WithdrawalSchema: Schema<IWithdrawal> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  accountHolder: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'REJECTED'],
    default: 'PENDING',
  },
  adminNote: {
    type: String,
    default: '',
  },
  processedAt: Date,
}, { timestamps: true });

const Withdrawal = (mongoose.models.Withdrawal as Model<IWithdrawal>) || mongoose.model<IWithdrawal>('Withdrawal', WithdrawalSchema);

export default Withdrawal;
