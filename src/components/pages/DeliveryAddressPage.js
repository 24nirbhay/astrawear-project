import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '../../config/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';
import { FaPlus, FaSave, FaTrash, FaMapMarkerAlt } from 'react-icons/fa';

const PageContainer = styled.div`
  min-height: 100vh; 
  padding: 100px 2rem 2rem 2rem; 
  background-color: #121212; 
  color: white;
  display: flex; 
  justify-content: center; 
  font-family: 'Montserrat', sans-serif;

  @media (max-width: 600px) {
    padding: 80px 1rem 2rem 1rem;
  }
`;

const ContentBox = styled.div`
  background: #1e1e1e; 
  padding: 40px; 
  border-radius: 16px; 
  width: 100%; 
  max-width: 600px;
  box-shadow: 0px 8px 24px rgba(0,0,0,0.8);
  border: 1px solid #334155;
`;

const Input = styled.input`
  width: 100%; 
  padding: 14px; 
  margin-bottom: 15px; 
  background: #0f172a;
  border: 1px solid #475569; 
  border-radius: 8px; 
  color: white; 
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;
  &:focus {
    outline: none;
    border-color: #60519b;
  }
`;

const Button = styled.button`
  width: 100%; 
  padding: 14px; 
  background: linear-gradient(135deg, #60519b, #8e7ce8);
  color: white; 
  border: none; 
  border-radius: 8px; 
  font-weight: bold; 
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const AddressCard = styled.div`
  background: #0f172a; 
  padding: 15px; 
  border-radius: 8px; 
  margin-bottom: 15px;
  border: 1px solid #475569;
`;

const DeliveryAddressPage = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ line1: '', city: '', state: '', postal_code: '' });

  const fetchAddresses = async () => {
    if (!user) return;
    const { data } = await supabase.from('addresses').select('*').eq('user_id', user.id);
    if (data) setAddresses(data);
  };

  useEffect(() => { fetchAddresses(); }, [user]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        user_id: user.id,
        line1: formData.line1,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        is_default: addresses.length === 0
      };

      const { error } = await supabase.from('addresses').insert([payload]);

      if (error) throw new Error(error.message);

      toast.success('Address saved successfully!');
      setShowForm(false);
      setFormData({ line1: '', city: '', state: '', postal_code: '' });
      fetchAddresses();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to save: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('addresses').delete().eq('id', id);
      if (error) throw new Error(error.message);
      fetchAddresses();
    } catch (error) {
      toast.error(`Delete failed: ${error.message}`);
    }
  };

  return (
    <PageContainer>
      <ContentBox>
        <Link to="/profile" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <FaArrowLeft /> Back to Profile
        </Link>
        <h2 style={{ marginTop: 0, fontFamily: 'Orbitron', display: 'flex', alignItems: 'center', gap: '10px' }}><FaMapMarkerAlt style={{color: '#5ebdd5'}}/> My Saved Addresses</h2>
        
        {addresses.map(addr => (
          <AddressCard key={addr.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h4 style={{ margin: '0 0 5px 0' }}>Shipping Destination</h4>
              <button onClick={() => handleDelete(addr.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}><FaTrash /> Delete</button>
            </div>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.4' }}>
              {addr.line1}<br/>
              {addr.city}, {addr.state} - {addr.postal_code}
            </p>
          </AddressCard>
        ))}

        {!showForm ? (
          <Button onClick={() => setShowForm(true)} style={{ marginTop: '20px' }}><FaPlus /> Add New Address</Button>
        ) : (
          <form onSubmit={handleAddAddress} style={{ marginTop: '30px' }}>
            <h3 style={{ borderTop: '1px solid #334155', paddingTop: '20px', fontFamily: 'Orbitron' }}>New Address</h3>
            <Input placeholder="Street Address (Line 1)" value={formData.line1} onChange={e => setFormData({...formData, line1: e.target.value})} required />
            <div style={{ display: 'flex', gap: '10px' }}>
              <Input placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
              <Input placeholder="State" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} required />
            </div>
            <Input placeholder="PIN Code / Postal Code" value={formData.postal_code} onChange={e => setFormData({...formData, postal_code: e.target.value})} required />
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button type="button" onClick={() => setShowForm(false)} style={{ background: '#334155' }}>Cancel</Button>
              <Button type="submit"><FaSave /> Save Address</Button>
            </div>
          </form>
        )}
      </ContentBox>
    </PageContainer>
  );
};

export default DeliveryAddressPage;