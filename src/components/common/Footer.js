import React from 'react';
import styled from 'styled-components';
import { FaInstagram} from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.12) 0%, #0d0d0d 60%);
  color: #b8b8b8;
  padding: 3.5rem 2rem 2.2rem 2rem;
  text-align: center;
  position: relative;
  margin-top: -3.5rem; /* Bleed into body */
  box-shadow: 0 -16px 40px 0 rgba(0,0,0,0.18);
  z-index: 2;
  border-top-left-radius: 2.5rem;
  border-top-right-radius: 2.5rem;
  overflow: hidden;
`;

const FooterLogo = styled.h2`
  font-family: orbitron;
  font-weight: 600;
  color: #d2d2d2ff;
  font-size: 2.3rem;
  letter-spacing: 2px;
  margin-bottom: 1.2rem;
  text-shadow: 0 2px 16px #322532cc;
`;

const SocialLinks = styled.div`
  margin-bottom: 1.2rem;
  a {
    color: #e248e2ff;
    font-size: 2rem;
    margin: 0 0.7rem;
    transition: color 0.3s, transform 0.3s;
    &:hover {
      color: #fff;
      transform: scale(1.18) rotate(-8deg);
    }
  }
`;

const Copyright = styled.p`
  font-size: 0.9rem;
  margin-top: 1.5rem;
  color: #b8b8b8;
`;

const Footer = () => (
  <FooterContainer>
    <FooterLogo></FooterLogo>
    <SocialLinks>
      <a href="https://www.instagram.com/_astrawear/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
    </SocialLinks>
    <p style={{color:'#ffffffff', fontFamily:'Montserrat',fontWeight:200, fontSize:'1.1rem', marginBottom:'0.2rem'}}>Loved by the Community.</p>
    <Copyright>&copy; {new Date().getFullYear()} Astrawear.</Copyright>
  </FooterContainer>
);

export default Footer;
