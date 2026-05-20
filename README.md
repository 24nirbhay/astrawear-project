# AstraWear

A full-stack e-commerce platform for clothing and apparel with comprehensive admin management.

## Features

- **Product Catalog** - Browse collections and product details with filtering
- **Shopping Cart** - Add items and manage purchases
- **Order Management** - Track orders and delivery status
- **User Authentication** - Secure sign-up and login
- **Admin Dashboard** - Manage products, orders, users, and support tickets
- **User Profiles** - Manage account info and payment methods
- **Customer Support** - Ticket system for customer inquiries
- **Notifications** - Order updates and alerts

## Tech Stack

- **Frontend**: React, Styled Components, Framer Motion, React Router
- **3D Graphics**: Three.js, React Three Fiber
- **State Management**: React Context API
- **Database**: Supabase
- **Data Fetching**: TanStack React Query
- **UI/UX**: Swiper (carousels), React Icons, Animated backgrounds

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## Build

```bash
npm run build
```

## Project Structure

- `components/` - Reusable UI components and page layouts
- `admin/` - Admin dashboard for business operations
- `context/` - Global state (Auth, Cart, Site Settings)
- `hooks/` - Custom React hooks
- `styles/` - Theming and global styles
- `utils/` - Helper functions
