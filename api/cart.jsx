import jwt from "jsonwebtoken";
import connectDB from "./_db";
import Cart from "./models/Cart";

export default async function handler(req, res) {
  await connectDB();

  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (req.method === "POST") {
    const cart = await Cart.findOneAndUpdate(
      { userId: decoded.userId },
      { $inc: { quantity: 1 } },
      { upsert: true, new: true }
    );
    return res.json(cart);
  }
if (req.method === "GET") {
    const cart = await Cart.findOne({ userId: decoded.userId });
    return res.json(cart || { quantity: 0 });
  }

  if (req.method === "DELETE") {
    await Cart.deleteOne({ userId: decoded.userId });
    return res.json({ success: true });
  }
}