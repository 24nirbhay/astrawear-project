import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaChevronDown, FaChevronUp } from 'react-icons/fa6';

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
  max-width: 700px;
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

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const FAQItem = styled.div`
  background: ${({ theme }) => theme.colors.bgTertiary};
  border: 1px solid ${({ theme }) => theme.colors.borderPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
`;

const FAQQuestion = styled.button`
  width: 100%;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s;
  &:hover {
    background: ${({ theme }) => theme.colors.bgMedium};
  }
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.accentPrimary};
  }
  @media (max-width: 600px) {
    padding: 0.8rem;
    font-size: 0.85rem;
  }
`;

const FAQAnswer = styled.div`
  padding: 0 1rem 1rem;
  font-size: 0.85rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textDim};
  @media (max-width: 600px) {
    padding: 0 0.8rem 0.8rem;
    font-size: 0.8rem;
  }
`;

const Icon = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.accentPrimary};
`;

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'What is AstraWear?',
      answer: 'AstraWear is a premium streetwear brand offering eco-friendly, hand-crafted apparel with unique designs inspired by cosmic art and modern aesthetics.',
    },
    {
      question: 'How do I place an order?',
      answer: "Browse our collections, select your desired product, choose your size, and click 'Buy Now'. You'll be guided through the checkout process with GPay payment.",
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'Currently, we accept GPay (Google Pay) for all transactions. More payment options will be added soon.',
    },
    {
      question: 'How long does shipping take?',
      answer: 'Orders are typically processed within 1-2 business days and delivered within 5-7 business days depending on your location.',
    },
    {
      question: 'Can I return or exchange items?',
      answer: 'Yes! We offer a 7-day return and exchange policy for unworn items with original tags. Contact our support team to initiate a return.',
    },
    {
      question: 'How do I track my order?',
      answer: "Once your order ships, you'll receive a tracking number via email. You can also check your order status in the Order History section of your profile.",
    },
  ];

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
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

        <PageTitle>Frequently Asked Questions</PageTitle>

        <FAQList role="list">
          {faqs.map((faq, index) => (
            <FAQItem key={index} role="listitem">
              <FAQQuestion
                onClick={() => toggle(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span>{faq.question}</span>
                <Icon>
                  {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                </Icon>
              </FAQQuestion>
              {openIndex === index && (
                <FAQAnswer id={`faq-answer-${index}`} role="region">
                  {faq.answer}
                </FAQAnswer>
              )}
            </FAQItem>
          ))}
        </FAQList>
      </ContentContainer>
    </PageWrapper>
  );
};

export default FAQPage;
