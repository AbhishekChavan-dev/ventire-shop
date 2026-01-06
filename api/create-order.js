import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).end("Method not allowed");

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // 1. Get the DISCOUNTED amount sent from the frontend
    const { amount, userId } = req.body; 

    const options = {
      // 2. Use the amount from the frontend and convert to Paise
      // We use Math.round to ensure it's an integer
      amount: Math.round(amount * 100), 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: userId,
      },
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ error: error.message });
  }
}