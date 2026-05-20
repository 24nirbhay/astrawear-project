import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTimes, FaSearchPlus, FaSearchMinus } from 'react-icons/fa';
import Buybutton from '../common/Buybutton';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../config/supabaseClient';
import toast from 'react-hot-toast';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #18171c, #23222b);
  padding: 0;
  color: #fff;
  font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
`;

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 2rem 4rem 2rem;

  @media (min-width: 850px) {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }

  @media (max-width: 600px) {
    padding: 80px 1rem 3rem 1rem;
  }
`;

const ImageColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #94a3b8;
  font-size: 1rem;
  text-decoration: none;
  transition: color 0.2s;
  &:hover { color: #fff; }
  margin-bottom: -0.5rem;
`;

const DetailsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 2rem;
`;

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4/5;
  background: #23222b;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  cursor: zoom-in;
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
  transition: transform 0.4s ease;
  &:hover { transform: scale(1.03); }
`;

const ThumbnailsContainer = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-thumb { background: #60519b; border-radius: 3px; }
`;

const Thumbnail = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
  border: 2px solid ${props => props.active ? '#8e7ce8' : 'transparent'};
  opacity: ${props => props.active ? 1 : 0.5};
  transition: all 0.2s ease-in-out;
  &:hover { opacity: 1; transform: translateY(-2px); }
`;

const SwiperDotStyle = createGlobalStyle`
  .swiper-pagination-bullets { bottom: 15px !important; }
  .swiper-pagination-bullet { width: 8px !important; height: 8px !important; background: #60519b !important; opacity: 0.7; margin: 0 3px !important; }
  .swiper-pagination-bullet-active { background: #fff !important; opacity: 1; box-shadow: none !important; }
`;

const ProductName = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  color: #fff;
  letter-spacing: 0.5px;
  line-height: 1.2;
`;

const InfoTags = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

const Pill = styled.div`
  background: linear-gradient(135deg, #60519b, #8e7ce8);
  color: #fff;
  border-radius: 999px;
  padding: 0.35rem 0.95rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const Price = styled.div`
  color: #5ebdd5ff;
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
`;

const DescriptionText = styled.p`
  font-size: 1.05rem;
  line-height: 1.7;
  color: #cbd5e1;
  margin: 0 0 1rem 0;
`;

const ZoomOverlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.92); z-index: 2000;
  display: flex; justify-content: center; align-items: center;
  overflow: hidden;
`;

const CloseZoom = styled.button`
  position: absolute; top: 2rem; right: 2rem;
  background: rgba(255,255,255,0.1); color: white; border: none; 
  border-radius: 50%; width: 50px; height: 50px; font-size: 1.5rem; 
  cursor: pointer; z-index: 2001; transition: background 0.2s;
  display: flex; justify-content: center; align-items: center;
  &:hover { background: rgba(255,255,255,0.2); }
`;

const ZoomControls = styled.div`
  position: absolute; bottom: 3rem; left: 50%; transform: translateX(-50%);
  display: flex; gap: 1.5rem; z-index: 2001;
  button {
    background: #60519b; color: white; border: none; border-radius: 50%;
    width: 50px; height: 50px; font-size: 1.2rem; cursor: pointer;
    display: flex; justify-content: center; align-items: center;
    box-shadow: 0 4px 15px rgba(0,0,0,0.5); transition: transform 0.2s;
    &:hover { transform: scale(1.1); filter: brightness(1.2); }
  }
`;

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReserving, setIsReserving] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Zoom state
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [activeZoomImage, setActiveZoomImage] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) toast.error('Error loading product');
      else setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleBuyNow = async () => {
    if (!user) {
      toast.error('Please login to purchase');
      navigate('/auth');
      return;
    }
    
    setIsReserving(true);
    // Call the RPC to lock the item for 10 minutes
    const { data, error } = await supabase.rpc('reserve_product', { p_product_id: product.id, p_lock_minutes: 10 });
    setIsReserving(false);

    if (error) {
      toast.error(error.message || 'Item is currently reserved or sold out.');
    } else {
      toast.success('Item reserved for 10 minutes!');
      // Pass the expiration time to the checkout page
      const expiresAt = Date.now() + 10 * 60 * 1000;
      navigate('/place-order', { state: { product, expiresAt } });
    }
  };

  if (loading) return <PageContainer>Loading...</PageContainer>;
  if (!product) return <PageContainer>Product not found</PageContainer>;

  const images = Array.isArray(product.images) ? product.images : [product.images];

  const openZoom = (img) => {
    setActiveZoomImage(img);
    setZoomLevel(1);
    setIsZoomModalOpen(true);
  };

  return (
    <PageContainer>
      <SwiperDotStyle />
      <LayoutGrid>
        <ImageColumn>
          <BackButton to="/">
            <FaArrowLeft /> Back to Store
          </BackButton>
          <CarouselWrapper>
            <Swiper 
              modules={[Pagination]} 
              pagination={{ clickable: true }} 
              slidesPerView={1} 
              onSwiper={setSwiperInstance}
              onSlideChange={(s) => setActiveIndex(s.activeIndex)}
              style={{ width: '100%', height: '100%' }}
            >
              {images.map((img, idx) => (
                <SwiperSlide key={idx} onClick={() => openZoom(img)}>
                  <CarouselImage src={img} alt={`${product.name} - Image ${idx + 1}`} />
                  <FaSearchPlus style={{ position: 'absolute', bottom: '25px', right: '25px', fontSize: '1.8rem', color: 'white', opacity: 0.8, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }} />
                </SwiperSlide>
              ))}
            </Swiper>
          </CarouselWrapper>
          
          {images.length > 1 && (
            <ThumbnailsContainer>
              {images.map((img, idx) => (
                <Thumbnail 
                  key={idx} 
                  src={img} 
                  active={idx === activeIndex} 
                  onClick={() => swiperInstance?.slideTo(idx)} 
                />
              ))}
            </ThumbnailsContainer>
          )}
        </ImageColumn>
        
        <DetailsColumn>
          <ProductName>{product.name}</ProductName>
          <Price>₹{product.price}</Price>
          <InfoTags>
            <Pill>Size • {product.size}</Pill>
            <Pill>Brand • {product.brand || 'Astrawear'}</Pill>
            <Pill>Category • {product.category || 'Streetwear'}</Pill>
            <Pill style={{ background: product.stock > 0 ? '#16a34a' : '#ef4444' }}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Sold Out'}
            </Pill>
          </InfoTags>
          <DescriptionText>
            {product.description || 'Elevate your aesthetic with this premium piece from Astrawear. Designed for comfort and built for the streets, featuring high-quality materials and a forward-thinking silhouette.'}
          </DescriptionText>
          
          <div style={{ marginTop: '1rem' }}>
            <Buybutton onClick={handleBuyNow}>
              {isReserving ? 'Reserving...' : 'Buy Now'}
            </Buybutton>
          </div>
        </DetailsColumn>
      </LayoutGrid>

      {/* Fullscreen Zoom Modal */}
      <AnimatePresence>
        {isZoomModalOpen && (
          <ZoomOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CloseZoom onClick={() => setIsZoomModalOpen(false)}>
              <FaTimes />
            </CloseZoom>
            <motion.img
              drag
              src={activeZoomImage}
              animate={{ scale: zoomLevel }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain', cursor: 'grab' }}
              whileTap={{ cursor: 'grabbing' }}
            />
            <ZoomControls>
              <button onClick={() => setZoomLevel(prev => Math.min(prev + 0.5, 4))}><FaSearchPlus /></button>
              <button onClick={() => setZoomLevel(prev => Math.max(prev - 0.5, 0.5))}><FaSearchMinus /></button>
            </ZoomControls>
          </ZoomOverlay>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default ProductDetailsPage;
