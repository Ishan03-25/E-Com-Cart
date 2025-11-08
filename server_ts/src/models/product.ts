import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct {
  name: string;
  price: number;
  description?: string;
  image?: string;
}

export interface IProductDoc extends Document, IProduct {}

const ProductSchema = new Schema<IProductDoc>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String }
}, { collection: 'Product' });

const Product = mongoose.model<IProductDoc>('Product', ProductSchema, 'Product');
export default Product;
