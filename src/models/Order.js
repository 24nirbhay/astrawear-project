// Order Model Schema Stub
// TODO: Uncomment and configure when MongoDB is connected

/*
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderItems: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: String,
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    image: String,
  }],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['UPI', 'Cash on Delivery', 'Card'],
    default: 'UPI',
  },
  paymentDetails: {
    transactionId: String,
    upiId: String,
    status: {
      type: String,
      enum: ['Pending', 'Verified', 'Failed'],
      default: 'Pending',
    },
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  orderStatus: {
    type: String,
    enum: ['Pending Payment', 'Payment Verified', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending Payment',
  },
  region: {
    type: String,
    default: 'IN',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  paidAt: Date,
  deliveredAt: Date,
}, {
  timestamps: true,
});

// Indexes for efficient queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
*/

// Placeholder export for mock environment
export const OrderSchema = {
  user: 'ObjectId (ref: User)',
  orderItems: [{
    product: 'ObjectId (ref: Product)',
    name: 'String',
    quantity: 'Number',
    price: 'Number',
    image: 'String',
  }],
  shippingAddress: {
    street: 'String (required)',
    city: 'String (required)',
    state: 'String (required)',
    postalCode: 'String (required)',
    country: 'String (required)',
    phone: 'String (required)',
  },
  paymentMethod: 'String (UPI/COD/Card)',
  paymentDetails: {
    transactionId: 'String',
    upiId: 'String',
    status: 'String (Pending/Verified/Failed)',
  },
  totalPrice: 'Number',
  orderStatus: 'String (Pending Payment/Verified/Processing/Shipped/Delivered/Cancelled)',
  region: 'String',
  createdAt: 'Date',
  paidAt: 'Date',
  deliveredAt: 'Date',
};

// TODO: Replace with actual Mongoose model when MongoDB is connected
export default null;
