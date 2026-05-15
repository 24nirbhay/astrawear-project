import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '../../config/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';

const PageContainer = styled.div`
  min-height: 100vh; padding: 100px 2rem 2rem 2rem; background-color: #121212; color: white;
  display: flex; justify-content: center; font-family: 'Montserrat', sans-serif;
`;

const ContentBox = styled.div`
  background: #1e293b; padding: 40px; border-radius: 12px; width: 100%; max-width: 600px;
`;

const Input = styled.input`
  width: 100%; padding: 12px; margin-bottom: 15px; background: #0f172a;
  border: 1px solid #475569; border-radius: 8px; color: white; box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%; padding: 14px; background: linear-gradient(135deg, #60519b, #8e7ce8);
  color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;
`;

const AddressCard = styled.div`
  background: #0f172a; padding: 15px; border-radius: 8px; margin-bottom: 15px;
  border: 1px solid #475569;
`;

const DeliveryAddressPage = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', line1: '', city: '', state: '', postal_code: '' });

  const fetchAddresses = async () => {
    if (!user) return;
    const { data } = await supabase.from('addresses').select('*').eq('user_id', user.id);
    if (data) setAddresses(data);
  };

  useEffect(() => { fetchAddresses(); }, [user]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('addresses').insert([{
      user_id: user.id, ...formData, is_default: addresses.length === 0
    }]);

    if (error) {
      toast.error('Failed to add address');
    } else {
      toast.success('Address saved successfully!');
      setShowForm(false);
      setFormData({ name: '', phone: '', line1: '', city: '', state: '', postal_code: '' });
      fetchAddresses();
    }
  };

  const handleDelete = async (id) => {
    await supabase.from('addresses').delete().eq('id', id);
    fetchAddresses();
  };

  return (
    <PageContainer>
      <ContentBox>
        <Link to="/profile" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <FaArrowLeft /> Back to Profile
        </Link>
        <h2 style={{ marginTop: 0 }}>My Addresses</h2>
        
        {addresses.map(addr => (
          <AddressCard key={addr.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h4 style={{ margin: '0 0 5px 0' }}>{addr.name} ({addr.phone})</h4>
              <button onClick={() => handleDelete(addr.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}>Delete</button>
            </div>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
              {addr.line1}, {addr.city}, {addr.state} - {addr.postal_code}
            </p>
          </AddressCard>
        ))}

        {!showForm ? (
          <Button onClick={() => setShowForm(true)} style={{ marginTop: '20px' }}>+ Add New Address</Button>
        ) : (
          <form onSubmit={handleAddAddress} style={{ marginTop: '30px' }}>
            <h3 style={{ borderTop: '1px solid #334155', paddingTop: '20px' }}>New Address</h3>
            <Input placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <Input placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
            <Input placeholder="Street Address (Line 1)" value={formData.line1} onChange={e => setFormData({...formData, line1: e.target.value})} required />
            <div style={{ display: 'flex', gap: '10px' }}>
              <Input placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
              <Input placeholder="State" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} required />
            </div>
            <Input placeholder="PIN Code / Postal Code" value={formData.postal_code} onChange={e => setFormData({...formData, postal_code: e.target.value})} required />
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button type="button" onClick={() => setShowForm(false)} style={{ background: '#334155' }}>Cancel</Button>
              <Button type="submit">Save Address</Button>
            </div>
          </form>
        )}
      </ContentBox>
    </PageContainer>
  );
};

export default DeliveryAddressPage;
