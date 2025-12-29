import { connectDB } from "../lib/mongodb";
import Order from "../models/Order";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const {
      orderId,
      paymentId,
      quantity,
      amount,
      status,
    } = req.body;

    if (!orderId || !paymentId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const order = await Order.create({
      orderId,
      paymentId,
      quantity,
      amount,
      status,
    });

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Mongo order save error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
