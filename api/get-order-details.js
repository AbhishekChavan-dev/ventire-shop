import connectDB from "../lib/mongodb.js";
import Order from "../models/Orders.js";

export default async function handler(req, res) {
    const { orderNo } = req.query;
    try {
        await connectDB();
        const order = await Order.findOne({ orderNumber: orderNo });
        if (!order) return res.status(404).json({ success: false });
        
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false });
    }
}