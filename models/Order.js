import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  paymentId: { type: String, required: true },
  quantity: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "PAID" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
