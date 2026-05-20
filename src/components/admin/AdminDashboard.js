import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import DashboardHome from './DashboardHome';
import TicketManagement from './TicketManagement';
import UserManagement from './UserManagement';
import { FaBars, FaTimes, FaArrowLeft } from 'react-icons/fa';

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
  transition: transform 0.3s ease-in-out;

  @media (max-width: 768px) {
    position: fixed;
    height: 100vh;
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    z-index: 1001;
    padding-top: 80px;
  }
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

const MenuToggle = styled.button`
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1002;
  background: #334155;
  border: none;
  color: white;
  font-size: 1.2rem;
  padding: 0.6rem;
  border-radius: 8px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const AdminDashboard = () => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <MenuToggle onClick={() => setSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </MenuToggle>
      <DashboardContainer>
        <Sidebar isOpen={isSidebarOpen}>
          <h3 style={{ marginTop: 0, marginBottom: '30px', color: '#5ebdd5ff' }}>Karmachari Panel</h3>
          <NavItem to="/admin" active={location.pathname === '/admin'} onClick={() => setSidebarOpen(false)}>Overview</NavItem>
          <NavItem to="/admin/products" active={location.pathname.includes('/products')} onClick={() => setSidebarOpen(false)}>Manage Drops</NavItem>
          <NavItem to="/admin/orders" active={location.pathname.includes('/orders')} onClick={() => setSidebarOpen(false)}>UPI Verifications</NavItem>
          <NavItem to="/admin/tickets" active={location.pathname.includes('/tickets')} onClick={() => setSidebarOpen(false)}>Support Tickets</NavItem>
          <NavItem to="/admin/users" active={location.pathname.includes('/users')} onClick={() => setSidebarOpen(false)}>Users</NavItem>
          <NavItem as="a" href="/" style={{ marginTop: '30px', borderTop: '1px solid #334155', paddingTop: '20px' }}>
            <FaArrowLeft style={{ marginRight: '10px' }} /> Back to Store
          </NavItem>
        </Sidebar>

        <Content>
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/tickets" element={<TicketManagement />} />
            <Route path="/users" element={<UserManagement />} />
          </Routes>
        </Content>
      </DashboardContainer>
    </>
  );
};

export default AdminDashboard;
