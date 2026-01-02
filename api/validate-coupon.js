import connectDB from "../../lib/mongodb.js";
import Promotion from "../../models/Promotion.js";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    try {
        await connectDB();
        const { code } = req.body;

        const promo = await Promotion.findOne({
            code: code.toUpperCase(),
            isActive: true
        });

        if (!promo) {
            return res.status(404).json({ message: "Coupon code not found or inactive." });
        }

        // Parse "20%" or "500" from the discount field
        const discountStr = promo.discount;
        const isPercentage = discountStr.includes("%");
        const discountValue = parseFloat(discountStr.replace("%", ""));

        return res.status(200).json({
            success: true,
            discountValue,
            isPercentage,
            code: promo.code
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}