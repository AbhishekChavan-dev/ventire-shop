import dbConnect from '../lib/mongodb.js'; // Adjust path to your db connection
import Product from '../models/Product.js';

export default async function handler(req, res) {
  await dbConnect();

  try {
    const products = await Product.find({});
    // 🟢 This must be a clean JSON response
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}