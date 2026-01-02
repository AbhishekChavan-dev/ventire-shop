import dbConnect from "../lib/mongodb.js";
import Promotion from "../models/Promotion.js";

export default async function handler(req, res) {
  await dbConnect();
  try {
    const promo = await Promotion.findOne({ type: 'banner_coupon', isActive: true });
    res.status(200).json({ success: true, data: promo || { code: "FREESHIP", discount: "FREE SHIPPING" } });
  } catch (error) {
    res.status(500).json({ success: false });
  }
}