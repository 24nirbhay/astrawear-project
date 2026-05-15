import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';
import Buybutton from '../common/Buybutton';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../config/supabaseClient';
import toast from 'react-hot-toast';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #18171c, #23222b);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0;
  color: #fff;
  font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 1rem;
  left: 1rem;
  color: #fff;
  font-size: 1rem;
  border-radius: 50%;
  padding: 0.35rem 0.6rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s, border 0.18s;
  z-index: 30;
`;

const MainContent = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 2.2rem 1.2rem 2.5rem 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
`;

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 480px;
  height: 420px;
  background: #23222b;
  display: flex;
  margin-top: 55px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 32px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 3px;
  box-shadow: 0px 8px 32px rgba(0,0,0,0.6);
  z-index: 1;
`;

const SwiperDotStyle = createGlobalStyle`
  .swiper-pagination-bullets { bottom: 10px !important; }
  .swiper-pagination-bullet { width: 8px !important; height: 8px !important; background: #60519b !important; opacity: 0.7; margin: 0 3px !important; }
  .swiper-pagination-bullet-active { background: #fff !important; opacity: 1; box-shadow: none !important; }
`;

const ProductName = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0.5rem 0 0.7rem 0;
  text-align: center;
  color: #fff;
  letter-spacing: 1.1px;
`;

const InfoTags = styled.div`
  display: flex;
  gap: 0.7rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
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
  font-size: 2.1rem;
  font-weight: 800;
  margin: 1.2rem 0 0.5rem 0;
`;

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReserving, setIsReserving] = useState(false);

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

  return (
    <PageContainer>
      <SwiperDotStyle />
      <CarouselWrapper>
        <BackButton to="/">
          <FaArrowLeft />
        </BackButton>
        <Swiper modules={[Pagination]} pagination={{ clickable: true }} slidesPerView={1} style={{ width: '100%', height: '100%' }}>
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <CarouselImage src={img} alt={`${product.name} - Image ${idx + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </CarouselWrapper>
      <MainContent>
        <Price>?{product.price}</Price>
        <ProductName>{product.name}</ProductName>
        <InfoTags>
          <Pill>Size • {product.size}</Pill>
          <Pill>Brand • {product.brand}</Pill>
          <Pill>Category • {product.category}</Pill>
        </InfoTags>
        <Buybutton onClick={handleBuyNow}>
          {isReserving ? 'Reserving...' : 'Buy Now'}
        </Buybutton>
      </MainContent>
    </PageContainer>
  );
};

export default ProductDetailsPage;
