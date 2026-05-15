// Review Model Schema Stub
// TODO: Uncomment and configure when MongoDB is connected

/*
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes for efficient queries
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
*/

// Placeholder export for mock environment
export const ReviewSchema = {
  user: 'ObjectId (ref: User)',
  product: 'ObjectId (ref: Product)',
  name: 'String (required)',
  rating: 'Number (1-5, required)',
  comment: 'String (required)',
  isVerifiedPurchase: 'Boolean',
  createdAt: 'Date',
};

// TODO: Replace with actual Mongoose model when MongoDB is connected
export default null;
