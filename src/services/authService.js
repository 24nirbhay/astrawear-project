// Auth Service - Authentication & User Management
// Currently uses mockApi.js - will be replaced with MongoDB + JWT

import { mockApi } from '../api/mockApi';

// TODO: Replace with MongoDB query + JWT token generation
// Example:
// const user = await User.findOne({ email });
// const isMatch = await user.matchPassword(password);
// const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const loginUser = async (email, password) => {
  try {
    // Normalize common email typos and casing
    let normalizedEmail = String(email || '').trim().toLowerCase();
    if (normalizedEmail.endsWith('@gamil.com')) {
      normalizedEmail = normalizedEmail.replace('@gamil.com', '@gmail.com');
    }

    // TODO: Replace with actual API call that returns JWT token
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password }),
    // });
    // const data = await response.json();
    // localStorage.setItem('token', data.token);
    // return data.user;
    
    const user = await mockApi.login(normalizedEmail, password);
    // Force admin privileges for configured admin credential
    if (normalizedEmail === 'email-admin@gmail.com' || normalizedEmail === 'admin@gmail.com') {
      user.isAdmin = true;
    }
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// TODO: Replace with MongoDB mutation + JWT token generation
// Example:
// const userExists = await User.findOne({ email });
// if (userExists) throw new Error('User already exists');
// const user = await User.create({ name, email, password });
// const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const registerUser = async (email, password, name) => {
  try {
    // Normalize common email typos and casing
    let normalizedEmail = String(email || '').trim().toLowerCase();
    if (normalizedEmail.endsWith('@gamil.com')) {
      normalizedEmail = normalizedEmail.replace('@gamil.com', '@gmail.com');
    }
    // TODO: Replace with actual API call
    // const response = await fetch('/api/auth/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, email, password }),
    // });
    // const data = await response.json();
    // localStorage.setItem('token', data.token);
    // return data.user;
    
    const user = await mockApi.register(normalizedEmail, password);
    // Mock: Store user in localStorage
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// TODO: Replace with JWT validation
// Example:
// const token = localStorage.getItem('token');
// const decoded = jwt.verify(token, process.env.JWT_SECRET);
// const user = await User.findById(decoded.id);

export const getCurrentUser = () => {
  try {
    // TODO: Replace with JWT token validation and user fetch
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Logout user
export const logoutUser = () => {
  // TODO: In production, also invalidate JWT token on server
  localStorage.removeItem('user');
  // localStorage.removeItem('token');
};

// Update user profile
// TODO: Replace with MongoDB mutation
// Example: await User.findByIdAndUpdate(userId, updates, { new: true });

export const updateUserProfile = async (userId, updates) => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/users/${userId}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //   },
    //   body: JSON.stringify(updates),
    // });
    // const data = await response.json();
    // return data;
    
    // Mock implementation: merge updates into the locally stored user
    const stored = localStorage.getItem('user');
    if (!stored) throw new Error('No user in session');
    const current = JSON.parse(stored);
    if (current.id !== userId) {
      // In a real API, this would be forbidden unless admin
      throw new Error('Cannot update another user profile');
    }
    const updated = { ...current, ...updates };
    localStorage.setItem('user', JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
