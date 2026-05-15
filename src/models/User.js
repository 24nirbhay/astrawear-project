// User Model Schema Stub
// TODO: Uncomment and configure when MongoDB is connected

/*
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    default: '',
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  region: {
    type: String,
    default: 'IN',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
*/

// Placeholder export for mock environment
export const UserSchema = {
  name: 'String (required)',
  email: 'String (required, unique)',
  password: 'String (required, hashed)',
  isAdmin: 'Boolean',
  phone: 'String',
  address: {
    street: 'String',
    city: 'String',
    state: 'String',
    postalCode: 'String',
    country: 'String',
  },
  region: 'String',
  createdAt: 'Date',
};

// TODO: Replace with actual Mongoose model when MongoDB is connected
// TODO: Implement password hashing with bcryptjs
export default null;
