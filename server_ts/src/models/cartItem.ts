import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  qty: number;
}

export interface ICartItemDoc extends Document, ICartItem {}

const CartItemSchema = new Schema<ICartItemDoc>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  qty: { type: Number, default: 1 }
}, { collection: 'CartItem' });

const CartItem = mongoose.model<ICartItemDoc>('CartItem', CartItemSchema, 'CartItem');
export default CartItem;
