import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    amount: Number,
    quantity: Number,
    status: String,
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
