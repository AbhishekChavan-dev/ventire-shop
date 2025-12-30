export const config = {
    runtime: "nodejs",
};
import crypto from "crypto"; // Built-in Node.js module
import connectDB from "../lib/mongodb.js";
import Order from "../models/Orders.js";

// Helper to generate code
const generateShortId = () => `VT-${Math.floor(1000 + Math.random() * 9000)}`;

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { orderId, paymentId, signature, amount, quantity, status, userId, useremail, address } = req.body;
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
        // 🟢 3. Validate address exists before saving
        if (!address || !address.street || !address.phone) {
            return res.status(400).json({ success: false, message: "Shipping address is required" });
        }
        console.log("📦 Order received:", req.body);

        const customOrderId = generateShortId(); // 🟢 Generate VT-XXXX

        if (!orderId) {
            return res.status(400).json({ error: "orderId missing" });
        }

        const savedOrder = await Order.create({
            orderNumber: customOrderId, // 🟢 Save the simple number
            userId: userId, // 👈 Link the order to the user
            useremail: useremail,
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
            amount,
            quantity,
            status,
            address: address, // 👈 This saves the street, city, pincode, and phone
        });

        {/*} return res.status(201).json({
            success: true,
            order: savedOrder,
        });*/}
        // 🟢 Send the custom ID back to the frontend
        res.status(200).json({
            success: true,
            displayId: customOrderId
        });
    } catch (error) {
        console.error("❌ Store order error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
