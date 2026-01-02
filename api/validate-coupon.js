import connectDB from "../lib/mongodb.js";
import Promotion from "../models/Promotion.js";

export default async function handler(req, res) {
  // 1. Prevent non-POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // 2. Ensure DB is connected BEFORE running queries
    await connectDB();

    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

    // 3. Use .lean() for faster, read-only performance (helps on Vercel)
    const promo = await Promotion.findOne({ 
      code: code.trim().toUpperCase(), 
      isActive: true 
    }).lean();

    if (!promo) {
      return res.status(404).json({ message: "Invalid or expired coupon code." });
    }

    // 4. Robust parsing of your "20%" string
    const discountStr = promo.discount ? promo.discount.toString() : "0"; 
    const isPercentage = discountStr.includes("%");
    const numericValue = parseFloat(discountStr.replace("%", ""));

    if (isNaN(numericValue)) {
      return res.status(500).json({ message: "Coupon data format error." });
    }

    return res.status(200).json({ 
      success: true, 
      discountValue: numericValue, 
      isPercentage: isPercentage,
      code: promo.code 
    });

  } catch (error) {
    // 5. Check if the error is a connection issue
    console.error("CRITICAL API ERROR:", error.message);
    return res.status(500).json({ 
      message: "Server Error", 
      error: error.message // This helps you see the actual error in the browser network tab
    });
  }
}