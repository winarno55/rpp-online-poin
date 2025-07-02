import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId; // Ditambahkan untuk mengatasi error tipe
  userId: mongoose.Types.ObjectId;
  packageId: mongoose.Types.ObjectId;
  points: number;
  price: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  provider: 'lynk' | 'manual';
  providerTransactionId?: string; // ID dari penyedia pembayaran
}

const TransactionSchema: Schema<ITransaction> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  packageId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'PENDING',
  },
  provider: {
    type: String,
    enum: ['lynk', 'manual'],
    default: 'lynk',
  },
  providerTransactionId: {
    type: String,
  },
}, { timestamps: true });

const Transaction = (mongoose.models.Transaction as Model<ITransaction>) || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;