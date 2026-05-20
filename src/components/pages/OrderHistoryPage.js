import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { getUserOrders } from '../admin/ordersService';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaBoxOpen } from 'react-icons/fa6';
import toast from 'react-hot-toast';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 100px 2rem 2rem 2rem;
  background-color: #121212;
  color: white;
  font-family: 'Montserrat', sans-serif;

  @media (max-width: 600px) {
    padding: 80px 1rem 2rem 1rem;
  }
`;

const OrderCard = styled.div`
  background: #1e293b;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  border: 1px solid #334155;
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${({ status }) => 
    status === 'Pending Verification' ? '#ca8a04' : 
    status === 'Payment Verified' ? '#16a34a' : 
    status === 'Shipped' ? '#2563eb' : '#475569'};
`;

const OrderHistoryPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUserOrders(user.id)
        .then(data => setOrders(data))
        .catch(err => toast.error('Failed to load orders'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <PageContainer><h2>Loading Orders...</h2></PageContainer>;

  return (
    <PageContainer>
      <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <FaArrowLeft /> Back to Shop
      </Link>
      <h2 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}><FaBoxOpen style={{color: '#8e7ce8'}}/> My Order History</h2>
      
      {orders.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>You haven't made any purchases yet.</p>
      ) : (
        orders.map(order => (
          <OrderCard key={order.id}>
            <div>
              <h3 style={{ margin: '0 0 10px 0' }}>{order.products?.name || 'Unknown Product'}</h3>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
                Order ID: {order.id.split('-')[0]}<br/>
                UPI TXN: {order.upi_transaction_id}<br/>
                Total: ₹{order.total_price}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <StatusBadge status={order.status}>{order.status}</StatusBadge>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '10px' }}>
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
          </OrderCard>
        ))
      )}
    </PageContainer>
  );
};

export default OrderHistoryPage;
