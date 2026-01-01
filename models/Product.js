import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  mrp: { 
    type: Number 
  },
  images: { 
    type: [String], // Array of strings
    default: ["/no_img.jpg"] 
  },
  category: { 
    type: String, 
    default: "Appliances" 
  },
  stock: { 
    type: Number, 
    default: 10 
  },
  // ✅ New fields for your UI features
  features: { 
    type: [String], // Array of strings for the bullet points
    default: [] 
  },
  badge: { 
    type: String, 
    default: "" // e.g., "Sale -28%"
  },
  tag: { 
    type: String, 
    default: "Best Seller" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Avoid "OverwriteModelError" on Vercel/Next.js hot reloads
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);