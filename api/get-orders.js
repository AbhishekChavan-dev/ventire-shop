import connectDB from "../lib/mongodb";
import Order from "../models/Orders";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await connectDB();
  const { userId } = req.query;

  try {
    // 🟢 Convert the string ID into a real MongoDB ObjectId
    const queryId = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    const orders = await Order.find({ userId: queryId }).sort({ createdAt: -1 });
    
    console.log(`Found ${orders.length} orders for user: ${userId}`);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}