// api/auth/signup.js
import connectDB from "../../lib/mongodb.js";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  
  await connectDB();
  const { email, password, name } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ error: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ email, password: hashedPassword, name });

  res.status(201).json({ message: "User created!" });
}