import express from "express";
import Razorpay from "razorpay";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post("/api/create-order", async (req, res) => {
  try {
    const { quantity } = req.body;
    const PRICE = 2499;

    const order = await razorpay.orders.create({
      amount: quantity * PRICE * 100, // paise
      currency: "INR",
      receipt: "ventire_" + Date.now(),
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/create-order", async (req, res) => {
  try {
    const { quantity } = req.body;

    const amount = quantity * 2499 * 100; // INR to paise

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `ventire_${Date.now()}`,
    });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Order creation failed" });
  }
});