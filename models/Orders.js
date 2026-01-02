import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    useremail: { type: String }, // Add this
    guestEmail: { type: String }, // Optional: add this to keep track of guest contact
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    amount: { type: Number, required: true },
    quantity: { type: Number, required: true },
    // 🟢 The New Items Array
    items: [{
      _id: String,
      name: String,
      price: Number,
      quantity: Number,
      images: [String]
    }],
    status: { type: String, required: true },
    // 🟢 NEW: Nested Address Object
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
      phone: { type: String, required: true }
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
