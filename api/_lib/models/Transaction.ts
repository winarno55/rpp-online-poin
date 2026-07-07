import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orderId: string;
  points: number;
  price: number;
  status: 'pending' | 'settlement' | 'expire' | 'deny' | 'cancel';
  paymentType?: string;
  midtransResponse?: any;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema<ITransaction> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: String, required: true, unique: true },
  points: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'settlement', 'expire', 'deny', 'cancel'], 
    default: 'pending' 
  },
  paymentType: { type: String },
  midtransResponse: { type: Schema.Types.Mixed },
}, { timestamps: true });

const Transaction = (mongoose.models.Transaction as Model<ITransaction>) || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
