import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).end("Method not allowed");

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { quantity, userId } = req.body;
    const options = {
      amount: quantity * 2499 * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: userId, // 👈 Store userId in Razorpay notes for safety
      },
    };
    const order = await razorpay.orders.create(options);

    // We send back the order, including the notes we just added
    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ error: error.message });
  }
}
{/*const order = await razorpay.orders.create({
      amount: quantity * 2499 * 100,
      currency: "INR",
    });

    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Create order error:", error);
    res.status(500).json({ error: "Order creation failed" });
  }
}*/}
