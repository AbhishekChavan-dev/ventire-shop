export const config = {
  runtime: "nodejs",
};

import connectDB from "../lib/mongodb";
import Order from "../models/Orders";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    console.log("📦 Order received:", req.body);

    const { orderId, paymentId, amount, quantity, status } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "orderId missing" });
    }

    const savedOrder = await Order.create({
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      amount,
      quantity,
      status,
    });

    return res.status(201).json({
      success: true,
      order: savedOrder,
    });
  } catch (error) {
    console.error("❌ Store order error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
