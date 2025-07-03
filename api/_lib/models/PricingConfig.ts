import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface untuk sub-dokumen Biaya Sesi
export interface ISessionCost extends Document {
  sessions: number; // 1, 2, 3, 4, 5
  cost: number; // e.g., 20, 40, 60, 80, 100
}

// Interface untuk sub-dokumen Paket Poin
export interface IPointPackage extends Document {
  points: number;
  price: number;
}

// Interface untuk sub-dokumen Metode Pembayaran
export interface IPaymentMethod extends Document {
  method: string; // e.g., 'DANA', 'BCA', 'ShopeePay'
  details: string; // e.g., '08123456789 a/n Nama' or '1234567890'
}

// Interface untuk dokumen utama PricingConfig
export interface IPricingConfig extends Document {
  pointPackages: IPointPackage[];
  paymentMethods: IPaymentMethod[];
  sessionCosts: ISessionCost[];
}

const SessionCostSchema: Schema<ISessionCost> = new Schema({
  sessions: { type: Number, required: true, unique: true },
  cost: { type: Number, required: true },
});

const PointPackageSchema: Schema<IPointPackage> = new Schema({
  points: { type: Number, required: true },
  price: { type: Number, required: true },
});

const PaymentMethodSchema: Schema<IPaymentMethod> = new Schema({
  method: { type: String, required: true },
  details: { type: String, required: true },
});

const PricingConfigSchema: Schema<IPricingConfig> = new Schema({
  pointPackages: [PointPackageSchema],
  paymentMethods: [PaymentMethodSchema],
  sessionCosts: [SessionCostSchema],
}, { timestamps: true });


const PricingConfig = (mongoose.models.PricingConfig as Model<IPricingConfig>) || mongoose.model<IPricingConfig>('PricingConfig', PricingConfigSchema);

export default PricingConfig;