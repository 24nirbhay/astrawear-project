import React, { useState, useEffect, Suspense, lazy } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaGoogle } from 'react-icons/fa';

const StarsBackground = lazy(() => import('./StarsBackground'));

const Container = styled.div`
  height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0a0a; color: white; position: relative; overflow: hidden;
`;

const BackgroundCanvas = styled.div`
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0;
`;

const Box = styled.div`
  background: rgba(15, 23, 42, 0.45); padding: 40px; border-radius: 16px; width: 100%; max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.1); 
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
`;

const Input = styled.input`
  width: 100%; padding: 14px; margin-bottom: 15px; background: #0f172a; border: 1px solid #475569;
  border-radius: 8px; color: white; box-sizing: border-box; font-family: 'Montserrat', sans-serif;
`;

const Button = styled.button`
  width: 100%; padding: 14px; background: linear-gradient(135deg, #60519b, #8e7ce8); color: white; 
  border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: filter 0.3s;
  &:hover { filter: brightness(1.1); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const GoogleButton = styled.button`
  width: 100%; padding: 14px; background: white; color: #121212; border: none; border-radius: 8px;
  font-weight: bold; cursor: pointer; transition: background 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 1rem;
  &:hover { background: #e2e8f0; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Divider = styled.div`
  display: flex; align-items: center; text-align: center; margin: 20px 0; color: #475569; font-size: 0.85rem; font-weight: bold;
  &::before, &::after { content: ''; flex: 1; border-bottom: 1px solid #334155; }
  &::before { margin-right: 1em; }
  &::after { margin-left: 1em; }
`;

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register, signInWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Welcome back');
      } else {
        await register(email, password);
        toast.success('Account created');
      }
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsSubmitting(true);
      await signInWithGoogle();
      // Navigation happens automatically via OAuth redirect
    } catch (err) {
      toast.error(err.message || 'Google authentication failed');
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <BackgroundCanvas>
        <Suspense fallback={null}>
          <StarsBackground />
        </Suspense>
      </BackgroundCanvas>
      <Box style={{ zIndex: 1 }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', fontFamily: 'Honk', fontSize: '2.5rem', letterSpacing: '1px' }}>
          {isLogin ? 'Welcome Back!' : 'New Here? Create an Account'}
        </h2>
        <GoogleButton type="button" onClick={handleGoogleAuth} disabled={isSubmitting || loading}>
          <FaGoogle /> Continue with Google
        </GoogleButton>
        <Divider>OR</Divider>
        <form onSubmit={handleAuth}>
          <Input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button type="submit" disabled={isSubmitting || loading}>
            {isSubmitting ? 'AUTHENTICATING...' : 'PROCEED'}
          </Button>
        </form>
        <p style={{ textAlign: 'center', cursor: 'pointer', marginTop: '20px', color: '#94a3b8' }} 
           onClick={() => !isSubmitting && setIsLogin(!isLogin)}>
          {isLogin ? "New User? Register" : "Existing User? Login"}
        </p>
      </Box>
    </Container>
  );
};

export default AuthPage;