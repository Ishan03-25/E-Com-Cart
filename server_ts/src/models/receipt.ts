import mongoose, { Document, Schema } from 'mongoose';

export interface IReceiptItem {
  product: mongoose.Types.ObjectId;
  qty: number;
  price: number;
}

export interface IReceipt {
  items: IReceiptItem[];
  total: number;
  name?: string;
  email?: string;
  createdAt?: Date;
}

export interface IReceiptDoc extends Document, IReceipt {}

const ReceiptSchema = new Schema<IReceiptDoc>({
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product' },
      qty: Number,
      price: Number
    }
  ],
  total: Number,
  name: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
}, { collection: 'Receipt' });

const Receipt = mongoose.model<IReceiptDoc>('Receipt', ReceiptSchema, 'Receipt');
export default Receipt;
