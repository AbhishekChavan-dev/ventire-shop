import crypto from "crypto";
import connectDB from "../lib/mongodb.js";
import Order from "../models/Orders.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // 1. Verify Webhook Secret (Set this in Razorpay Dashboard)
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  const shasum = crypto.createHmac("sha256", webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (signature !== digest) {
    return res.status(400).json({ msg: "Invalid signature" });
  }

  // 2. Handle Payment Captured Event
  const event = req.body.event;
  if (event === "payment.captured") {
    const payment = req.body.payload.payment.entity;
    
    await connectDB();
    
    // Use findOneAndUpdate with upsert: true 
    // This prevents double-entries if both the frontend AND the webhook run
    await Order.findOneAndUpdate(
      { razorpayOrderId: payment.order_id },
      {
        razorpayPaymentId: payment.id,
        amount: payment.amount / 100,
        status: "paid",
      },
      { upsert: true } 
    );
  }

  res.status(200).json({ status: "ok" });
}