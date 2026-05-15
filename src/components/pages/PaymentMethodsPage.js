import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaTrash } from 'react-icons/fa6';

const PageWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.bgPrimary};
  min-height: 100vh;
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 0 1rem 4rem;
  font-family: ${({ theme }) => theme.fonts.primary};
  display: flex;
  justify-content: center;
  align-items: flex-start;
  @media (max-width: 600px) {
    padding: 0.7rem 0.5rem 2rem;
  }
`;

const ContentContainer = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  margin-top: 5rem;
  position: relative;
  @media (max-width: 600px) {
    padding: 1rem 0.7rem;
    margin-top: 3rem;
  }
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.5rem;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.1);
  }
  @media (max-width: 600px) {
    top: 1rem;
    left: 1rem;
    font-size: 1.2rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: 1.2px;
  @media (max-width: 600px) {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
  }
`;

const PaymentMethodCard = styled.div`
  background: ${({ theme }) => theme.colors.bgTertiary};
  border: 1px solid ${({ theme }) => theme.colors.borderPrimary};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  @media (max-width: 600px) {
    padding: 0.75rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const MethodInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
`;

const MethodName = styled.span`
  font-weight: 600;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const MethodDetail = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: 'Courier New', monospace;
`;

const RemoveButton = styled.button`
  background: transparent;
  border: 1px solid #e53935;
  color: #e53935;
  padding: 0.4rem 0.7rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: background 0.2s;
  min-height: 36px;
  &:hover {
    background: rgba(229, 57, 53, 0.1);
  }
  &:focus-visible {
    outline: 2px solid #60519b;
    outline-offset: 2px;
  }
  @media (max-width: 600px) {
    align-self: flex-end;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
  label {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
  input {
    background: ${({ theme }) => theme.colors.bgTertiary};
    border: 1px solid ${({ theme }) => theme.colors.borderPrimary};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: 0.75rem;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 0.95rem;
    font-family: 'Courier New', monospace;
    outline: none;
    transition: border 0.2s, box-shadow 0.2s;
    min-height: 44px;
  }
  input:focus {
    border-color: ${({ theme }) => theme.colors.accentPrimary};
    box-shadow: 0 0 0 2px rgba(96, 81, 155, 0.25);
  }
  small {
    font-size: 0.75rem;
    color: #e53935;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const AddMethodButton = styled.button`
  background: ${({ theme }) => theme.colors.gradientPurple};
  border: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 0.7rem 1.2rem;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 44px;
  flex: 1;
  &:hover {
    filter: brightness(1.1);
  }
  &:focus-visible {
    outline: 2px solid #60519b;
    outline-offset: 2px;
  }
`;

const CancelButton = styled.button`
  background: transparent;
  border: 1px solid #555;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 0.7rem 1.2rem;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 44px;
  flex: 1;
  &:hover {
    background: rgba(255,255,255,0.05);
  }
  &:focus-visible {
    outline: 2px solid #60519b;
    outline-offset: 2px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: ${({ theme }) => theme.colors.textDim};
  font-size: 0.95rem;
`;

const PaymentMethodsPage = () => {
  const [methods, setMethods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('paymentMethods');
    if (stored) {
      setMethods(JSON.parse(stored));
    }
  }, []);

  const validateUpiId = (id) => {
    // Basic UPI ID validation: should contain @ and have format like user@bank
    const upiPattern = /^[\w.-]+@[\w.-]+$/;
    return upiPattern.test(id);
  };

  const addUpiId = () => {
    setError('');
    if (!upiId.trim()) {
      setError('Please enter a UPI ID');
      return;
    }
    if (!validateUpiId(upiId)) {
      setError('Invalid UPI ID format (e.g., yourname@paytm)');
      return;
    }
    const newMethod = { id: Date.now(), type: 'UPI', detail: upiId.trim() };
    const updated = [...methods, newMethod];
    setMethods(updated);
    localStorage.setItem('paymentMethods', JSON.stringify(updated));
    setUpiId('');
    setShowForm(false);
  };

  const removeMethod = (id) => {
    const updated = methods.filter(m => m.id !== id);
    setMethods(updated);
    localStorage.setItem('paymentMethods', JSON.stringify(updated));
  };

  return (
    <PageWrapper>
      <ContentContainer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BackButton to="/profile" aria-label="Back to profile">
          <FaArrowLeft />
        </BackButton>

        <PageTitle>Payment Methods</PageTitle>

        {methods.length === 0 && !showForm && (
          <EmptyState>No payment methods added yet.</EmptyState>
        )}

        {methods.map(method => (
          <PaymentMethodCard key={method.id}>
            <MethodInfo>
              <MethodName>UPI Payment</MethodName>
              <MethodDetail>{method.detail}</MethodDetail>
            </MethodInfo>
            <RemoveButton onClick={() => removeMethod(method.id)} aria-label={`Remove ${method.detail}`}>
              <FaTrash /> Remove
            </RemoveButton>
          </PaymentMethodCard>
        ))}

        {!showForm && (
          <AddMethodButton onClick={() => setShowForm(true)}>+ Add UPI ID</AddMethodButton>
        )}

        {showForm && (
          <div>
            <FormField>
              <label htmlFor="upi_id">UPI ID</label>
              <input
                id="upi_id"
                type="text"
                placeholder="yourname@paytm"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? 'upi-error' : undefined}
              />
              {error && <small id="upi-error" role="alert">{error}</small>}
            </FormField>
            <ButtonGroup>
              <AddMethodButton onClick={addUpiId}>Save UPI ID</AddMethodButton>
              <CancelButton onClick={() => { setShowForm(false); setUpiId(''); setError(''); }}>Cancel</CancelButton>
            </ButtonGroup>
          </div>
        )}
      </ContentContainer>
    </PageWrapper>
  );
};

export default PaymentMethodsPage;
