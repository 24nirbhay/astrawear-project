import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getAllOrdersForAdmin, updateOrderStatus } from '../../services/ordersService';
import toast from 'react-hot-toast';

const Container = styled.div`
  background: #1e293b;
  padding: 25px;
  border-radius: 12px;
  color: white;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  
  th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #334155;
  }
  
  th { color: #94a3b8; font-weight: 600; }
`;

const Select = styled.select`
  background: #0f172a;
  color: white;
  border: 1px solid #475569;
  padding: 8px;
  border-radius: 6px;
  outline: none;
`;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrdersForAdmin();
      setOrders(data);
    } catch (err) {
      toast.error('Failed to load admin orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders(); // Refresh table
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <Container>Loading Orders...</Container>;

  return (
    <Container>
      <h2>Manage Orders & Verifications</h2>
      <Table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Item</th>
            <th>UPI Txn ID</th>
            <th>Total</th>
            <th>Status / Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{new Date(order.created_at).toLocaleDateString()}</td>
              <td>@{order.profiles?.username}</td>
              <td>{order.products?.name}</td>
              <td style={{ fontFamily: 'monospace', color: '#5ebdd5ff' }}>{order.upi_transaction_id}</td>
              <td>?{order.total_price}</td>
              <td>
                <Select 
                  value={order.status} 
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="Pending Verification">Pending Verification</option>
                  <option value="Payment Verified">Payment Verified (Sold)</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </Select>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default OrderManagement;
