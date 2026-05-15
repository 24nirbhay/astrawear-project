import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #0f172a;
  color: white;
  padding-top: 80px; /* Offset for Navbar */
`;

const Sidebar = styled.div`
  width: 250px;
  background: #1e293b;
  padding: 20px;
  border-right: 1px solid #334155;
`;

const NavItem = styled(Link)`
  display: block;
  padding: 12px 15px;
  color: ${props => props.active ? '#fff' : '#94a3b8'};
  background: ${props => props.active ? '#334155' : 'transparent'};
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 10px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover { background: #334155; color: white; }
`;

const Content = styled.div`
  flex: 1;
  padding: 30px;
  overflow-y: auto;
`;

const AdminDashboard = () => {
  const location = useLocation();

  return (
    <DashboardContainer>
      <Sidebar>
        <h3 style={{ marginTop: 0, marginBottom: '30px', color: '#5ebdd5ff' }}>Karmachari Panel</h3>
        <NavItem to="/admin" active={location.pathname === '/admin'}>Overview</NavItem>
        <NavItem to="/admin/products" active={location.pathname.includes('/products')}>Manage Drops</NavItem>
        <NavItem to="/admin/orders" active={location.pathname.includes('/orders')}>UPI Verifications</NavItem>
      </Sidebar>

      <Content>
        <Routes>
          <Route path="/" element={
            <div style={{ background: '#1e293b', padding: '30px', borderRadius: '12px' }}>
              <h2>Welcome to the Engine Room</h2>
              <p style={{ color: '#94a3b8' }}>Use the sidebar to upload new drops or verify pending UPI payments.</p>
            </div>
          } />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/orders" element={<OrderManagement />} />
        </Routes>
      </Content>
    </DashboardContainer>
  );
};

export default AdminDashboard;
