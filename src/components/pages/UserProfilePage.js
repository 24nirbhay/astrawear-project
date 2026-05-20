import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../config/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import { FaMapMarkerAlt, FaCamera } from 'react-icons/fa';
import { FaArrowLeft, FaShieldHalved, FaBoxOpen, FaPowerOff, FaSave, FaTimes } from 'react-icons/fa6';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 100px 2rem 5rem 2rem;
  background: linear-gradient(135deg, #121212, #1a1a1a);
  color: white;
  font-family: 'Montserrat', sans-serif;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  @media (max-width: 600px) {
    padding: 80px 1rem 3rem 1rem;
  }
`;

const ProfileCard = styled.div`
  background: #1e1e1e;
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%;
  max-width: 600px;
  box-shadow: 0px 8px 24px rgba(0,0,0,0.8);
  border: 1px solid #334155;
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid #60519b;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0f172a;
  
  &:hover .overlay {
    opacity: 1;
  }
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarOverlay = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s;
  color: white;
  font-size: 1.5rem;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  label { 
    display: block; 
    margin-bottom: 8px; 
    color: #94a3b8; 
    font-size: 0.85rem; 
    font-weight: 600; 
    text-transform: uppercase; 
    letter-spacing: 1px;
  }
  input {
    width: 100%; 
    padding: 14px; 
    background: #0f172a; 
    border: 1px solid #475569;
    border-radius: 8px; 
    color: white; 
    font-family: 'Montserrat', sans-serif;
    font-size: 1rem;
    transition: border 0.3s;
    &:focus {
      outline: none;
      border-color: #60519b;
    }
    &:disabled { 
      opacity: 0.6; 
      background: #1e293b;
    }
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #60519b, #8e7ce8);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-family: 'Montserrat', sans-serif;
  transition: filter 0.2s;
  flex: 1;
  
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    filter: brightness(1.1);
  }
`;

const OutlineButton = styled(Button)`
  background: transparent;
  border: 1px solid #475569;
  
  &:hover {
    background: #334155;
    filter: none;
  }
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 3rem;
  border-top: 1px solid #334155;
  padding-top: 2rem;
`;

const ActionButton = styled.button`
  background: #0f172a;
  color: white;
  border: 1px solid #334155;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s;
  
  &:hover {
    background: #1e293b;
    border-color: #60519b;
    transform: translateY(-2px);
  }
`;

const UserProfilePage = () => {
  const { user, isAdmin, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profile, setProfile] = useState({ full_name: '', phone: '', username: '', avatar_url: '' });
  const [form, setForm] = useState({ full_name: '', phone: '', username: '' });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { replace: true });
      return;
    }

    const fetchProfile = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
        if (error) throw error;
        if (data) {
          setProfile(data);
          setForm({ full_name: data.full_name || '', phone: data.phone || '', username: data.username || '' });
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, [user, authLoading, navigate]);

  const handleAvatarUpload = async (event) => {
    try {
      setUploadingAvatar(true);
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw new Error(uploadError.message || 'Storage upload failed');
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);

      // Use UPSERT with all fields to prevent NOT NULL constraints and fix missing profiles
      const fallbackUsername = user?.email?.split('@')[0] || `user${Math.floor(Math.random() * 1000)}`;
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          avatar_url: data.publicUrl,
          username: profile.username || fallbackUsername,
          full_name: profile.full_name || null,
          phone: profile.phone || null
        })
        .select('*')
        .single();

      if (updateError) {
        throw new Error(updateError.message || 'Database update failed');
      }

      setProfile(updatedProfile || { ...profile, avatar_url: data.publicUrl });
      if (updatedProfile) {
        setForm({
          full_name: updatedProfile.full_name || '',
          phone: updatedProfile.phone || '',
          username: updatedProfile.username || ''
        });
      }
      toast.success('Profile picture updated!');
    } catch (error) {
      console.error(error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    try {
      // Use UPSERT to support older users whose profiles might not exist yet
      const fallbackUsername = user?.email?.split('@')[0] || `user${Math.floor(Math.random() * 1000)}`;
      const { data: updatedProfile, error } = await supabase.from('profiles').upsert({ 
        id: user.id,
        full_name: form.full_name,
        phone: form.phone,
        username: form.username || fallbackUsername,
        avatar_url: profile.avatar_url || null
      })
      .select('*')
      .single();
      
      if (error) throw new Error(error.message);
      
      setProfile(updatedProfile || { ...profile, ...form });
      if (updatedProfile) {
        setForm({
          full_name: updatedProfile.full_name || '',
          phone: updatedProfile.phone || '',
          username: updatedProfile.username || ''
        });
      }
      setIsEditing(false);
      toast.success('Profile saved successfully');
    } catch (err) {
      console.error(err);
      toast.error(`Failed to save: ${err.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      // Attempt to log out on the backend
      await logout();
    } catch (error) {
      console.error("Backend logout error:", error);
      // We don't care if it errors here, we are kicking the user out locally anyway.
    } finally {
      // Nuclear clear of all local storage in case Supabase keys are stuck
      localStorage.clear();
      sessionStorage.clear();
      
      toast.success('Severed connection (Logged out)');
      
      // Hard redirect to clear all React state completely from memory
      window.location.href = '/';
    }
  };

  if (authLoading) return null; 

  return (
    <PageContainer>
      <ProfileCard>
        <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <FaArrowLeft /> Back to Store
        </Link>
        
        <h2 style={{ fontFamily: 'Orbitron', marginBottom: '2rem', textAlign: 'center', letterSpacing: '1px' }}>
          Account Settings
        </h2>
        
        <AvatarContainer>
          <label htmlFor="avatar-upload">
            <AvatarWrapper className="avatar-wrapper">
              {profile.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt="Profile" />
              ) : (
                <span style={{ fontSize: '2rem', color: '#60519b', fontFamily: 'Orbitron' }}>
                  {profile.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              )}
              <AvatarOverlay className="overlay">
                <FaCamera />
              </AvatarOverlay>
            </AvatarWrapper>
          </label>
          <HiddenFileInput 
            id="avatar-upload" 
            type="file" 
            accept="image/*" 
            onChange={handleAvatarUpload} 
            disabled={uploadingAvatar} 
          />
          <p style={{ marginTop: '10px', fontSize: '0.85rem', color: '#94a3b8' }}>
            {uploadingAvatar ? 'Uploading...' : 'Tap to change picture'}
          </p>
        </AvatarContainer>

        <FormGroup>
          <label>Username</label>
          <input 
            value={isEditing ? form.username : `@${profile.username || ''}`} 
            onChange={e => setForm({...form, username: e.target.value.replace(/[^a-z0-9_]/gi, '')})}
            disabled={!isEditing} 
            placeholder="Enter a unique username"
          />
          {isEditing && <small style={{color: '#94a3b8', marginTop: '5px', display: 'block'}}>Usernames can only contain letters, numbers, and underscores.</small>}
        </FormGroup>

        <FormGroup>
          <label>Full Name</label>
          <input 
            value={isEditing ? form.full_name : (profile.full_name || '')} 
            onChange={e => setForm({...form, full_name: e.target.value})} 
            disabled={!isEditing} 
            placeholder="Enter your full name"
          />
        </FormGroup>

        <FormGroup>
          <label>Phone</label>
          <input 
            value={isEditing ? form.phone : (profile.phone || '')} 
            onChange={e => setForm({...form, phone: e.target.value})} 
            disabled={!isEditing} 
            placeholder="Enter your phone number"
          />
        </FormGroup>

        <div style={{ display: 'flex', gap: '15px', marginTop: '2rem' }}>
          {isEditing ? (
            <>
              <Button onClick={handleSave}><FaSave /> Save Changes</Button>
              <OutlineButton onClick={() => setIsEditing(false)}><FaTimes /> Cancel</OutlineButton>
            </>
          ) : (
            <OutlineButton onClick={() => setIsEditing(true)}>Edit Profile</OutlineButton>
          )}
        </div>

        <ActionGrid>
          <ActionButton onClick={() => navigate('/delivery-address')}>
            <FaMapMarkerAlt style={{ color: '#5ebdd5' }} /> Addresses
          </ActionButton>
          
          <ActionButton onClick={() => navigate('/orders')}>
            <FaBoxOpen style={{ color: '#8e7ce8' }} /> Orders
          </ActionButton>

          {isAdmin && (
            <ActionButton onClick={() => navigate('/admin')} style={{ borderColor: '#60519b', background: 'rgba(96, 81, 155, 0.1)' }}>
              <FaShieldHalved style={{ color: '#60519b' }} /> Admin Dashboard
            </ActionButton>
          )}
          
          <ActionButton onClick={handleLogout} style={{ borderColor: '#ef4444', color: '#ef4444' }}>
            <FaPowerOff /> Log Out
          </ActionButton>
        </ActionGrid>
      </ProfileCard>
    </PageContainer>
  );
};

export default UserProfilePage;