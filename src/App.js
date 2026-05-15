import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SiteSettingsProvider, useSiteSettings } from './context/SiteSettingsContext';
import { THEME_PRESETS } from './constants/themePresets';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './components/pages/HomePage';
import ProductDetailPage from './components/pages/ProductDetailPage';
import AboutPage from './components/pages/AboutPage';
import AuthPage from './components/common/AuthPage';
import UserProfilePage from './components/pages/UserProfilePage';
import OrderHistoryPage from './components/pages/OrderHistoryPage';
import PaymentMethodsPage from './components/pages/PaymentMethodsPage';
import NotificationsPage from './components/pages/NotificationsPage';
import FAQPage from './components/pages/FAQPage';
import ContactSupportPage from './components/pages/ContactSupportPage';
import AdminDashboard from './components/admin/AdminDashboard';
import Collections from './components/pages/Collections';
import PlaceOrder from './components/pages/PlaceOrder';
import DeliveryAddressPage from './components/pages/DeliveryAddressPage';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div style={{ color: 'white', padding: '50px', textAlign: 'center' }}>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/collections" element={<Collections />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/place-order" element={<ProtectedRoute><PlaceOrder /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
      <Route path="/payment-methods" element={<ProtectedRoute><PaymentMethodsPage /></ProtectedRoute>} />
      <Route path="/delivery-address" element={<ProtectedRoute><DeliveryAddressPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/support" element={<ContactSupportPage />} />
      <Route path="/admin/*" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const ThemedApp = () => {
  const { settings } = useSiteSettings();
  const preset = THEME_PRESETS[settings?.currentThemeKey] || THEME_PRESETS.default;
  const mergedTheme = {
    ...theme,
    colors: { ...theme.colors, ...preset?.colors },
  };
  
  return (
    <ThemeProvider theme={mergedTheme}>
      <GlobalStyle />
      <Toaster position="bottom-center" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #475569' } }} />
      <Navbar />
      <AppRoutes />
      <Footer />
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <SiteSettingsProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <ThemedApp />
          </Router>
        </CartProvider>
      </AuthProvider>
    </SiteSettingsProvider>
  );
};

export default App;
