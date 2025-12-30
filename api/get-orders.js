// api/get-orders.js
import connectDB from "../lib/mongodb";
import Order from "../models/Orders";
import mongoose from "mongoose";

export default async function handler(req, res) {
  // 1. Connect to Database
  try {
    await connectDB();
  } catch (err) {
    return res.status(500).json({ error: "Database connection failed" });
  }

  const { userId } = req.query;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // 2. Querying logic
    // We search for the ID as a string AND as an ObjectId to be safe
    const orders = await Order.find({
      $or: [
        { userId: userId },
        { userId: new mongoose.Types.ObjectId(userId) }
      ]
    }).sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Order Fetch Error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}