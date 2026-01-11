import connectDB from "../lib/mongodb.js";
import Subscriber from "../models/Subscriber.js";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  try {
    await connectDB();

    // Check if already exists
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'You are already subscribed!' });
    }

    await Subscriber.create({ email });

    return res.status(200).json({ success: true, message: 'Welcome to the Ventire family!' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}