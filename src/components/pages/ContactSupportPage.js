import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { supabase } from '../../config/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 100px 2rem 2rem 2rem;
  background-color: #121212;
  color: white;
  font-family: 'Montserrat', sans-serif;
  display: flex;
  justify-content: center;
`;

const FormBox = styled(motion.form)`
  background: #1e293b;
  padding: 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  border: 1px solid #334155;
`;

const Input = styled.input`
  width: 100%; padding: 12px; margin-bottom: 15px; background: #0f172a;
  border: 1px solid #475569; border-radius: 8px; color: white; box-sizing: border-box;
`;

const TextArea = styled.textarea`
  width: 100%; padding: 12px; margin-bottom: 15px; background: #0f172a;
  border: 1px solid #475569; border-radius: 8px; color: white; box-sizing: border-box;
  min-height: 120px; resize: vertical;
`;

const Button = styled.button`
  width: 100%; padding: 14px; background: linear-gradient(135deg, #60519b, #8e7ce8);
  color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const ContactSupportPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', phone: '', query: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.query) {
      return toast.error('Please fill out all fields');
    }

    setIsSubmitting(true);
    const { error } = await supabase.from('tickets').insert([{
      user_id: user?.id || null,
      name: formData.name,
      phone: formData.phone,
      query: formData.query
    }]);

    setIsSubmitting(false);

    if (error) {
      toast.error('Failed to submit ticket. Try again later.');
    } else {
      toast.success('Ticket submitted! We will contact you soon.');
      setFormData({ name: '', phone: '', query: '' });
    }
  };

  return (
    <PageContainer>
      <FormBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <FaArrowLeft /> Back
        </Link>
        <h2 style={{ marginTop: 0 }}>Contact Support</h2>
        <p style={{ color: '#94a3b8', marginBottom: '25px' }}>Need help with an order? Drop us a line.</p>
        
        <Input 
          placeholder="Your Name" value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})} required 
        />
        <Input 
          placeholder="Phone Number" value={formData.phone} 
          onChange={(e) => setFormData({...formData, phone: e.target.value})} required 
        />
        <TextArea 
          placeholder="How can we help you?" value={formData.query} 
          onChange={(e) => setFormData({...formData, query: e.target.value})} required 
        />
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Submit Ticket'}
        </Button>
      </FormBox>
    </PageContainer>
  );
};

export default ContactSupportPage;
