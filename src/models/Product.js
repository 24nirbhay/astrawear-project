// Product Model Schema Stub
// TODO: Uncomment and configure when MongoDB is connected

/*
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: [String], // Array of image URLs
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: 'Streetwear',
  },
  brand: {
    type: String,
    default: 'AstraWear',
  },
  size: {
    type: String,
    default: 'M',
  },
  soldOut: {
    type: Boolean,
    default: false,
  },
  stock: {
    type: Number,
    default: 0,
  },
  region: {
    type: String,
    default: 'IN', // Target region (e.g., 'IN' for India)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes for efficient queries
productSchema.index({ region: 1, soldOut: 1 });
productSchema.index({ category: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
*/

// Placeholder export for mock environment
export const ProductSchema = {
  name: 'String (required)',
  price: 'Number (required)',
  image: '[String] (array of URLs)',
  description: 'String',
  category: 'String',
  brand: 'String',
  size: 'String',
  soldOut: 'Boolean',
  stock: 'Number',
  region: 'String',
  createdAt: 'Date',
  updatedAt: 'Date',
};

// TODO: Replace with actual Mongoose model when MongoDB is connected
export default null;
