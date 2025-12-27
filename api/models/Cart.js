import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  userId: String,
  quantity: Number,
});

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
