import 'dotenv/config';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import Product from './models/product';
import CartItem from './models/cartItem';
import Receipt from './models/receipt';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vibe_cart';

mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connect error', err));

// GET /api/products
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const products = await Product.find().lean();
    return res.status(200).json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/cart  { productId, qty }
app.post('/api/cart', async (req: Request, res: Response) => {
  try {
    const { productId, qty } = req.body as { productId?: string; qty?: number };
    if (!productId || typeof qty !== 'number') return res.status(400).json({ error: 'productId and qty required' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    let item = await CartItem.findOne({ product: productId }) as any;
    if (item) {
      item.qty = qty;
      await item.save();
    } else {
      item = await CartItem.create({ product: productId, qty }) as any;
    }

    const populated = await CartItem.findById(item._id).populate('product') as any;
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add/update cart item' });
  }
});

// DELETE /api/cart/:id
app.delete('/api/cart/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await CartItem.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete cart item' });
  }
});

// GET /api/cart
app.get('/api/cart', async (req: Request, res: Response) => {
  try {
    const items = await CartItem.find().populate('product').lean();
    let total = 0;
    const mapped = (items as any[]).map(i => {
      const price = i.product?.price || 0;
      const line = price * i.qty;
      total += line;
      return {
        id: i._id,
        product: i.product,
        qty: i.qty,
        line
      };
    });
    res.json({ items: mapped, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/checkout { name, email }
app.post('/api/checkout', async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body as { name?: string; email?: string };
    const items = await CartItem.find().populate('product').lean();
    if (!items.length) return res.status(400).json({ error: 'Cart is empty' });

    let total = 0;
    const receiptItems = (items as any[]).map(i => {
      const price = i.product?.price || 0;
      const line = price * i.qty;
      total += line;
      return {
        product: i.product._id,
        qty: i.qty,
        price: price
      };
    });

    const receipt = await Receipt.create({ items: receiptItems, total, name, email });

    // clear cart
    await CartItem.deleteMany({});

    const populated = await Receipt.findById(receipt._id).populate('items.product').lean();
    res.json({ receipt: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

// GET /api/receipts
app.get('/api/receipts', async (req: Request, res: Response) => {
  try {
    const receipts = await Receipt.find().populate('items.product').lean();
    res.json(receipts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch receipts' });
  }
});

// GET /api/receipts/:id
app.get('/api/receipts/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const receipt = await Receipt.findById(id).populate('items.product').lean();
    if (!receipt) return res.status(404).json({ error: 'Receipt not found' });
    res.json(receipt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch receipt' });
  }
});

// Health
app.get('/api/health', (req: Request, res: Response) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
