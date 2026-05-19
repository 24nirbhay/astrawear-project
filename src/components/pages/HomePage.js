import React, { Suspense, lazy } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import Spacebutton from '../common/Spacebutton';
import { useProducts } from '../../hooks/useProducts';
import { useSiteSettings } from '../../context/SiteSettingsContext';

const StarsBackground = lazy(() => import('../common/StarsBackground'));

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const HeroSection = styled.section`
  height: 100vh; width: 100%; position: relative; display: flex; flex-direction: column;
  justify-content: center; align-items: center; color: white; text-align: center;
  overflow: hidden; animation: ${fadeIn} 1s ease-in;
`;

const BackgroundCanvas = styled.div`
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;
`;

const Headline = styled(motion.h1)`
  font-size: 5rem; font-weight: 900; font-family: 'Honk'; letter-spacing: -1px;
  line-height: 1.1; text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
`;

const SubHeadline = styled(motion.p)`
  font-size: 1.2rem; max-width: 600px; margin-top: 1rem;
`;

const marquee = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const TickerStrip = styled.div`
  position: absolute; bottom: 0; width: 100%; background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px); padding: 0.5rem 0; overflow: hidden; white-space: nowrap;
`;

const TickerContent = styled.div`
  display: inline-block; animation: ${marquee} 30s linear infinite;
`;

const TickerText = styled.span`
  display: inline-block; font-size: 1rem; text-transform: uppercase;
  letter-spacing: 2px; font-weight: 500; color: #ccc; padding: 0 1rem;
`;

const NewDropsSection = styled.section`
  padding: 2rem 2rem; background-color: #0d0d0d; color: white; text-align: center;
  font-family: 'Montserrat', sans-serif; margin-bottom: 8rem;
`;

const NewDropsTitle = styled.h2`
  font-size: 3.5rem; font-family: 'Bungee', sans-serif; text-align: center;
  margin-bottom: 2.2rem; font-weight: 200; letter-spacing: 2px; text-transform: uppercase; color: #f1f1f1;
`;

const ProductsGrid = styled.div`
  display: grid; gap: 2.5rem; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  max-width: 1200px; margin: 0 auto; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: minmax(350px, auto);
    .large-card { grid-column: span 2; grid-row: span 2; }
  }
`;

const HomePage = () => {
  const { products, loading, error } = useProducts();
  const { settings } = useSiteSettings();

  return (
    <>
      <HeroSection>
        <BackgroundCanvas>
          <Suspense fallback={null}>
            <StarsBackground />
          </Suspense>
        </BackgroundCanvas>
        <Headline initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}>
          COMMUNITY-DRIVEN CULTURE
        </Headline>
        <SubHeadline initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }}>
          Limited drops. Designed for the street. Ready for the future.
        </SubHeadline>
        <Spacebutton initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 1.2 }}>
          <a href="#newdrops">Shop Now</a>
        </Spacebutton>
        <TickerStrip animate={{ x: ['100%', '-100%'] }} transition={{ x: { repeat: Infinity, duration: 30, ease: 'linear' } }}>
          <TickerContent>
            {(settings?.tickerMessages?.length ? settings.tickerMessages : [
              'Limited Drops', 'Built for the Streets', 'Future-Ready Fashion', 'Minimalist Aesthetic', 'Custom-Made Collection', 'Quick-Delivery',
            ]).concat(settings?.tickerMessages || []).map((msg, idx) => (
              <TickerText key={idx}>{msg}</TickerText>
            ))}
          </TickerContent>
        </TickerStrip>
      </HeroSection>
      
      <NewDropsSection id="newdrops">
        {settings?.specialBannerText && (
          <div style={{ margin: '0 auto 1rem', color: '#ccc', fontSize: '0.95rem' }}>{settings.specialBannerText}</div>
        )}
        <NewDropsTitle>New Drops</NewDropsTitle>
        {loading && <p>Loading products...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {!loading && !error && (
          <ProductsGrid>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductsGrid>
        )}
      </NewDropsSection>
    </>
  );
};

export default HomePage;
