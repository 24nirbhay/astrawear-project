import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaBell, FaBellSlash } from 'react-icons/fa6';
import { useAuth } from '../../hooks/useAuth';

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

const NotificationToggle = styled.div`
  background: ${({ theme }) => theme.colors.bgTertiary};
  border: 1px solid ${({ theme }) => theme.colors.borderPrimary};
  padding: 1.2rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  @media (max-width: 600px) {
    padding: 1rem 0.8rem;
  }
`;

const ToggleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ToggleIcon = styled.div`
  font-size: 1.5rem;
  color: ${({ enabled, theme }) => enabled ? theme.colors.accentSuccess : theme.colors.textDim};
`;

const ToggleText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const ToggleLabel = styled.span`
  font-weight: 600;
  font-size: 1rem;
`;

const ToggleDescription = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textDim};
`;

const ToggleSwitch = styled.button`
  position: relative;
  width: 50px;
  height: 26px;
  background: ${({ enabled, theme }) => enabled ? theme.colors.accentSuccess : '#555'};
  border: none;
  border-radius: 13px;
  cursor: pointer;
  transition: background 0.3s;
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.accentPrimary};
  }
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ enabled }) => enabled ? '26px' : '3px'};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: left 0.3s;
  }
`;

const InfoText = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textDim};
  line-height: 1.5;
  text-align: center;
  margin-top: 1rem;
`;

const NotificationsPage = () => {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Load from localStorage for this user
    if (user) {
      const key = `notifications_${user.id}`;
      const stored = localStorage.getItem(key);
      setEnabled(stored === 'true');
    }
  }, [user]);

  const toggleNotifications = () => {
    const newState = !enabled;
    setEnabled(newState);
    if (user) {
      const key = `notifications_${user.id}`;
      localStorage.setItem(key, String(newState));
      // TODO: In production, register/unregister push notification service worker
      if (newState) {
        console.log('Push notifications enabled for new launches');
      } else {
        console.log('Push notifications disabled');
      }
    }
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

        <PageTitle>Push Notifications</PageTitle>

        <NotificationToggle>
          <ToggleInfo>
            <ToggleIcon enabled={enabled}>
              {enabled ? <FaBell /> : <FaBellSlash />}
            </ToggleIcon>
            <ToggleText>
              <ToggleLabel>New Launches</ToggleLabel>
              <ToggleDescription>
                Get notified about new product drops
              </ToggleDescription>
            </ToggleText>
          </ToggleInfo>
          <ToggleSwitch
            enabled={enabled}
            onClick={toggleNotifications}
            aria-label={`${enabled ? 'Disable' : 'Enable'} notifications`}
            role="switch"
            aria-checked={enabled}
          />
        </NotificationToggle>

        <InfoText>
          {enabled
            ? "You'll receive notifications when we launch new products."
            : 'Enable notifications to stay updated on our latest drops.'}
        </InfoText>
      </ContentContainer>
    </PageWrapper>
  );
};

export default NotificationsPage;
