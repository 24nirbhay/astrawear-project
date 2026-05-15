import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Container = styled.div`
  height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0a0a; color: white;
`;

const Box = styled.div`
  background: #1e293b; padding: 40px; border-radius: 16px; width: 100%; max-width: 400px;
  border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.5);
`;

const Input = styled.input`
  width: 100%; padding: 14px; margin-bottom: 15px; background: #0f172a; border: 1px solid #475569;
  border-radius: 8px; color: white; box-sizing: border-box; font-family: 'Montserrat', sans-serif;
`;

const Button = styled.button`
  width: 100%; padding: 14px; background: #60519b; color: white; border: none; border-radius: 8px;
  font-weight: bold; cursor: pointer; transition: opacity 0.3s;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register, user, loading } = useAuth();
  const navigate = useNavigate();

  // If user becomes available while on this page, redirect immediately
  useEffect(() => {
    if (user && !loading) {
      navigate('/profile');
    }
  }, [user, loading, navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(username, password);
        toast.success('Welcome back');
      } else {
        await register(username, password);
        toast.success('Account created');
      }
      // Redirect handled by useEffect above
    } catch (err) {
      toast.error(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Box>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', fontFamily: 'Orbitron' }}>
          {isLogin ? 'ASTRA LOGIN' : 'JOIN ASTRA'}
        </h2>
        <form onSubmit={handleAuth}>
          <Input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'AUTHENTICATING...' : 'PROCEED'}
          </Button>
        </form>
        <p style={{ textAlign: 'center', cursor: 'pointer', marginTop: '20px', color: '#94a3b8' }} 
           onClick={() => !isSubmitting && setIsLogin(!isLogin)}>
          {isLogin ? "New Operative? Register" : "Existing Operative? Login"}
        </p>
      </Box>
    </Container>
  );
};

export default AuthPage;
