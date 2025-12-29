import connectDB from "../lib/mongodb";
import Order from "../models/Orders";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).end("Method not allowed");

  try {
    await connectDB();

    console.log("📦 Order received:", req.body);

    const {
      orderId,
      paymentId,
      amount,
      quantity,
      status,
    } = req.body;

    const savedOrder = await Order.create({
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      amount,
      quantity,
      status,
    });

    res.status(201).json({
      success: true,
      order: savedOrder,
    });
  } catch (error) {
    console.error("❌ Store order error:", error);
    res.status(500).json({ success: false });
  }
}
