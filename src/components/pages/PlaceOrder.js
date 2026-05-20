import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../../config/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const PageContainer = styled.div`
  padding: 80px 2rem;
  background-color: #121212;
  min-height: 100vh;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OrderForm = styled.div`
  background: #1e293b;
  padding: 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.6);
`;

const TimerText = styled.h3`
  color: #ff4d4d;
  text-align: center;
  margin: 0;
  font-family: 'Orbitron', sans-serif;
`;

const QrImage = styled.img`
  width: 200px;
  height: 200px;
  margin: 0 auto;
  border-radius: 8px;
  border: 2px solid #60519b;
  object-fit: cover;
`;

const Input = styled.input`
  background: #334155;
  color: #f1f5f9;
  border: 1px solid #475569;
  border-radius: 8px;
  padding: 12px 15px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
`;

const Select = styled.select`
  background: #334155;
  color: #f1f5f9;
  border: 1px solid #475569;
  border-radius: 8px;
  padding: 12px 15px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #60519b, #8e7ce8);
  color: #fff;
  border: none;
  padding: 14px 18px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.3s;
  &:hover { filter: brightness(1.1); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const CancelButton = styled(Button)`
  background: #334155;
  &:hover {
    background: #475569;
    filter: none;
  }
`;


const PlaceOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { product, expiresAt } = location.state || {};
  const [timeLeft, setTimeLeft] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!expiresAt) {
      navigate('/');
      return;
    }

    const interval = setInterval(() => {
      const remaining = expiresAt - Date.now();
      if (remaining <= 0) {
        clearInterval(interval);
        toast.error('Reservation expired. Item released.');
        navigate('/');
      } else {
        setTimeLeft(Math.floor(remaining / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, navigate]);

  useEffect(() => {
    const fetchAddresses = async () => {
      const { data, error } = await supabase.from('addresses').select('*').eq('user_id', user.id);
      if (!error && data && data.length > 0) {
        setAddresses(data);
        const defaultAddr = data.find(a => a.is_default);
        setSelectedAddress(defaultAddr ? defaultAddr.id : data[0].id);
      }
    };
    if (user) fetchAddresses();
  }, [user]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleConfirmOrder = async () => {
    if (!selectedAddress) return toast.error('Please select a delivery address');
    if (!transactionId || transactionId.length < 10) return toast.error('Please enter a valid UPI Transaction ID');

    setIsSubmitting(true);
    const addressDetails = addresses.find(a => a.id === selectedAddress);

    const { data, error } = await supabase.rpc('place_order', {
      p_product_id: product.id,
      p_shipping_address: addressDetails,
      p_upi_txn_id: transactionId
    });

    setIsSubmitting(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Order placed successfully! Awaiting verification.');
      navigate('/order-history'); 
    }
  };

  if (!product) return null;

  return (
    <PageContainer>
      <OrderForm>
        <TimerText>Time Remaining: {formatTime(timeLeft)}</TimerText>
        
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 5px 0' }}>{product.name}</h4>
          <div style={{ fontSize: '1.5rem', color: '#5ebdd5ff', fontWeight: 'bold' }}>₹{product.price}</div>
        </div>

        <div style={{ textAlign: 'center', background: '#0f172a', padding: '15px', borderRadius: '8px' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#94a3b8' }}>Scan to Pay</p>
          <QrImage src="/upi-qr.png" alt="UPI QR Code" />
          <p style={{ margin: '10px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>Astrawear Official UPI</p>
        </div>

        <Select value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)}>
          <option value="" disabled>Select Delivery Address</option>
          {addresses.map(addr => (
            <option key={addr.id} value={addr.id}>
              {addr.name} - {addr.line1}, {addr.city}
            </option>
          ))}
        </Select>

        <Input 
          type="text" 
          placeholder="Enter 12-digit UPI Transaction ID" 
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
          <Button onClick={handleConfirmOrder} disabled={isSubmitting || timeLeft <= 0}>
            {isSubmitting ? 'Verifying...' : 'Confirm Order'}
          </Button>
          <CancelButton onClick={() => navigate(`/product/${product.id}`)} disabled={isSubmitting}>
            Cancel
          </CancelButton>
        </div>
      </OrderForm>
    </PageContainer>
  );
};

export default PlaceOrder;
