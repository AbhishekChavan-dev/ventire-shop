import mongoose from 'mongoose';

const PromotionSchema = new mongoose.Schema({
  type: { 
    type: String, 
    default: 'banner_coupon',
    unique: true 
  },
  code: { 
    type: String, 
    required: true 
  },
  discount: { 
    type: String, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.models.Promotion || mongoose.model('Promotion', PromotionSchema);