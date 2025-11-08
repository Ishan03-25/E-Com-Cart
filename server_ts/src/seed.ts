import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './models/product';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vibe_cart';

mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB for seeding');
    const count = await Product.countDocuments();
    if (count > 0) {
      console.log('Products already seeded');
      process.exit(0);
    }

    const products = [
      { name: 'Vibe Hoodie', price: 49.99, description: 'Cozy hoodie', image: '' },
      { name: 'Retro Sneakers', price: 79.99, description: 'Comfort + style', image: '' },
      { name: 'Wireless Earbuds', price: 59.99, description: 'Great sound', image: '' },
      { name: 'Classic Tee', price: 19.99, description: 'Everyday tee', image: '' },
      { name: 'Denim Jacket', price: 99.99, description: 'Timeless jacket', image: '' },
      { name: 'Stylus Pen', price: 25.0, description: 'For creatives', image: '' },
      { name: 'Travel Mug', price: 14.5, description: 'Keeps drinks hot', image: '' },
      { name: 'Laptop Sleeve', price: 29.99, description: 'Protect your laptop', image: '' }
    ];

    await Product.insertMany(products);
    console.log('Seeded products');
    process.exit(0);
  })
  .catch(err => {
    console.error('Seed failed', err);
    process.exit(1);
  });
