import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBundleSession extends Document {
  userId: mongoose.Types.ObjectId;
  status: 'active' | 'completed' | 'failed';
  createdAt: Date;
}

const BundleSessionSchema: Schema<IBundleSession> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'completed', 'failed'], default: 'active' },
  createdAt: { type: Date, default: Date.now, expires: '1h' }, // Auto-delete after 1 hour
});

const BundleSession = (mongoose.models.BundleSession as Model<IBundleSession>) || mongoose.model<IBundleSession>('BundleSession', BundleSessionSchema);

export default BundleSession;
