import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    amount: { type: Number, required: true },
    quantity: { type: Number, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
