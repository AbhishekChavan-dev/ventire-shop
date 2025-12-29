import connectDB from "../lib/mongodb";
import Order from "../models/Orders";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        error: "Empty request body",
      });
    }

    console.log("📦 Store Order Body:", req.body);

    const {
      orderId,
      paymentId,
      amount,
      quantity = 1,
      status = "paid",
    } = req.body;

    const savedOrder = await Order.create({
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      amount,
      quantity,
      status,
    });

    return res.status(201).json({
      success: true,
      orderId: savedOrder._id,
    });
  } catch (error) {
    console.error("❌ Store order error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
