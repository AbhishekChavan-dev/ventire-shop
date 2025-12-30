export const config = {
    runtime: "nodejs",
};
import crypto from "crypto"; // Built-in Node.js module
import connectDB from "../lib/mongodb.js";
import Order from "../models/Orders.js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { orderId, paymentId, signature, amount, quantity, userId, status } = req.body;
        // 1. SECURITY CHECK: Verify the Signature
        const secret = process.env.RAZORPAY_KEY_SECRET;
        const generated_signature = crypto
            .createHmac("sha256", secret)
            .update(orderId + "|" + paymentId)
            .digest("hex");

        if (generated_signature !== signature) {
            console.error("❌ Security Alert: Invalid Signature!");
            return res.status(400).json({ success: false, message: "Transaction invalid" });
        }
        await connectDB();

        console.log("📦 Order received:", req.body);



        if (!orderId) {
            return res.status(400).json({ error: "orderId missing" });
        }

        const savedOrder = await Order.create({
            userId: userId, // 👈 Link the order to the user
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
