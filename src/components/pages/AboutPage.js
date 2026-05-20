import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PageContainer = styled.div`
  padding: 100px 2rem 5rem 2rem;
  background-color: #121212;
  min-height: 100vh;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  @media (max-width: 900px) {
    padding: 90px 1.5rem 3rem 1.5rem;
  }
  @media (max-width: 600px) {
    padding: 80px 1rem 2rem 1rem;
  }
`;

const Title = styled.h1`
  font-family: 'Honk', sans-serif;
  font-size: 3.2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #ffcc00;
  @media (max-width: 600px) {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`;

const Subtitle = styled.p`
  font-family: 'Montserrat', sans-serif;
  max-width: 700px;
  margin: 0 auto 3rem;
  font-size: 1.1rem;
  text-align: center;
  line-height: 1.6;
  opacity: 0.85;
`;

const TeamGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto 4rem auto;
  @media (max-width: 900px) {
    gap: 1.2rem;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
    max-width: 98vw;
  }
`;

const TeamCard = styled(motion.a)`
  background: #1e1e1e;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0px 4px 20px rgba(0,0,0,0.6);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 250px;
  max-width: 320px;
  flex: 1 1 250px;
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0px 6px 25px rgba(196, 108, 255, 0.73);
  }
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff4d4d, #ffcc00, #4dff88);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Honk', cursive;
  font-size: 2rem;
  color: #121212;
`;

const Name = styled.h2`
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Role = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  opacity: 0.7;
  margin-bottom: 1rem;
  text-align: center;
`;

const Bio = styled.p`
  font-size: 0.95rem;
  line-height: 1.5;
  opacity: 0.85;
  text-align: center;
`;

const BrandSection = styled.div`
  margin-bottom: 4rem;
  width: 100%;
  max-width: 900px;
  @media (max-width: 900px) {
    max-width: 98vw;
  }
`;

const BrandTitle = styled.h2`
  font-family: 'Honk', sans-serif;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #ffcc00;
`;

const BrandText = styled.p`
  font-family: 'Montserrat', sans-serif;
  max-width: 750px;
  margin: 0 auto;
  font-size: 1.15rem;
  line-height: 1.8;
  opacity: 0.9;
  text-align: center;
`;

const AboutPage = () => {
  return (
    <PageContainer>
      <BrandSection>
        <BrandTitle>About Astrawear</BrandTitle>
        <BrandText>
          Astrawear — Made for Makers.<br />
          We combine futuristic fashion with digital-first experiences, creating pieces that don't just fit, but tell a story.  
          Every drop is designed with precision, crafted with creativity, and delivered with passion.  
        </BrandText>
      </BrandSection>
      
      <Title>Meet the Team</Title>
      <Subtitle>
        At Astrawear, we are a group of dreamers and builders, pushing the boundaries of streetwear and digital fashion.
      </Subtitle>

      <TeamGrid>
        <TeamCard
          href="https://instagram.com/_ckidd_"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
        >
          <Avatar>
            <img 
              src={process.env.PUBLIC_URL + '/about/mukes.png'} 
              alt="Mukesh - Driver" 
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
            />
          </Avatar>
          <Name>mukes</Name>
          <Role>Driver</Role>
          <Bio>
            Visionary behind Astrawear's unique style, drives futuristic aesthetics with bold streetwear to make fashion truly timeless.
          </Bio>
        </TeamCard>

        <TeamCard
          href="https://instagram.com/nirbhayy______"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
        >
          <Avatar>
            <img 
              src={process.env.PUBLIC_URL + '/about/zod.jpg'} 
              alt="Zod - Karmachari no. 1" 
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
            />
          </Avatar>
          <Name>Zod</Name>
          <Role>Karmachari no. 1</Role>
          <Bio>
            Creator of Astrawear's digital universe, crafts immersive online experiences that bring our collections to life.
          </Bio>
        </TeamCard>

        <TeamCard
          href="https://instagram.com/_miss_cottoncandy_"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
        >
          <Avatar>
            <img 
              src={process.env.PUBLIC_URL + '/about/candy.jpg'} 
              alt="Cottoncandy - Lichi peeler" 
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
            />
          </Avatar>
          <Name>cottoncandy</Name>
          <Role>Lichi peeler</Role>
          <Bio>
            The backbone of Astrawear's digital journey, ensures seamless experiences from product drops to the collection pages.
          </Bio>
        </TeamCard>
      </TeamGrid>
    </PageContainer>
  );
};

export default AboutPage;
