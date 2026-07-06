import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISavedDocument extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  type: 'modul' | 'bundle';
  data: any;
  createdAt: Date;
  updatedAt: Date;
}

const SavedDocumentSchema: Schema<ISavedDocument> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['modul', 'bundle'], required: true },
  data: { type: Schema.Types.Mixed, required: true },
}, { timestamps: true });

const SavedDocument = (mongoose.models.SavedDocument as Model<ISavedDocument>) || mongoose.model<ISavedDocument>('SavedDocument', SavedDocumentSchema);
export default SavedDocument;
