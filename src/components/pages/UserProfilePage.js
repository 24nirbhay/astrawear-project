import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../config/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaShieldHalved, FaBoxOpen, FaCreditCard, FaPowerOff } from 'react-icons/fa6';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 100px 2rem 5rem 2rem;
  background-color: #0a0a0a;
  color: white;
  font-family: 'Montserrat', sans-serif;
  display: flex;
  justify-content: center;
`;

const GlassCard = styled.div`
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%;
  max-width: 800px;
  height: fit-content;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  label { display: block; margin-bottom: 8px; color: #94a3b8; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; }
  input {
    width: 100%; padding: 14px; background: rgba(15, 23, 42, 0.6); border: 1px solid #475569;
    border-radius: 8px; color: white; font-family: 'Montserrat', sans-serif;
    &:disabled { opacity: 0.6; }
  }
`;

const UserProfilePage = () => {
  const { user, isAdmin, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [profile, setProfile] = useState({ full_name: '', phone: '', username: '' });
  const [form, setForm] = useState({ full_name: '', phone: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
        if (data) {
          setProfile(data);
          setForm({ full_name: data.full_name || '', phone: data.phone || '' });
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setDataLoading(false);
      }
    };

    if (!authLoading) {
      if (!user) navigate('/auth');
      else fetchProfile();
    }
  }, [user, authLoading, navigate]);

  const handleSave = async () => {
    const { error } = await supabase.from('profiles').update(form).eq('id', user.id);
    if (error) {
      toast.error('Update failed');
    } else {
      setProfile({ ...profile, ...form });
      setIsEditing(false);
      toast.success('Profile updated');
    }
  };

  if (authLoading || dataLoading) {
    return <PageContainer><h2 style={{ fontFamily: 'Orbitron' }}>LOADING...</h2></PageContainer>;
  }

  return (
    <PageContainer>
      <GlassCard>
        <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <FaArrowLeft /> Back to Store
        </Link>
        <h2 style={{ fontFamily: 'Orbitron', marginBottom: '2rem' }}>Account Settings</h2>
        
        <FormGroup>
          <label>Username</label>
          <input value={`@${profile.username}`} disabled />
        </FormGroup>

        <FormGroup>
          <label>Full Name</label>
          <input value={isEditing ? form.full_name : (profile.full_name || 'Not provided')} 
                 onChange={e => setForm({...form, full_name: e.target.value})} 
                 disabled={!isEditing} />
        </FormGroup>

        <FormGroup>
          <label>Phone Number</label>
          <input value={isEditing ? form.phone : (profile.phone || 'Not provided')} 
                 onChange={e => setForm({...form, phone: e.target.value})} 
                 disabled={!isEditing} />
        </FormGroup>

        <div style={{ display: 'flex', gap: '15px', marginTop: '2rem' }}>
          {isEditing ? (
            <>
              <button onClick={handleSave} style={{ background: '#60519b', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Save Changes</button>
              <button onClick={() => setIsEditing(false)} style={{ background: '#334155', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} style={{ background: '#60519b', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Edit Profile</button>
          )}
        </div>

        <div style={{ marginTop: '3rem', borderTop: '1px solid #334155', paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {isAdmin && (
            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'rgba(96, 81, 155, 0.2)', color: '#8e7ce8', padding: '14px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', border: '1px solid #60519b' }}>
              <FaShieldHalved /> Admin Dashboard
            </Link>
          )}
          <button onClick={() => navigate('/orders')} style={{ background: 'transparent', color: 'white', padding: '14px', borderRadius: '8px', border: '1px solid #334155', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <FaBoxOpen /> Order History
          </button>
          <button onClick={logout} style={{ color: '#ef4444', background: 'transparent', border: 'none', marginTop: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <FaPowerOff /> Log Out
          </button>
        </div>
      </GlassCard>
    </PageContainer>
  );
};

export default UserProfilePage;
