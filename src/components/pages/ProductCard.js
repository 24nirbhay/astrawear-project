import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Card = styled(motion.div)`
  position: relative; overflow: hidden; border-radius: 16px; background-color: #1a1a1a;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); cursor: pointer; transition: transform 0.3s ease, filter 0.3s;
  display: flex; flex-direction: column; align-items: stretch; min-height: 340px; padding: 0;
  filter: ${props => props.soldout ? 'grayscale(0.8) brightness(0.7)' : 'none'};
  opacity: ${props => props.soldout ? 0.7 : 1};
  pointer-events: ${props => props.soldout ? 'none' : 'auto'};
  
  a { text-decoration: none; color: #fff; display: flex; flex-direction: column; flex: 1; height: 100%; }
  &:hover { transform: translateY(-8px); box-shadow: 0 8px 25px rgba(96, 81, 155, 0.8); }
`;

const SoldOutOverlay = styled.div`
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(30,30,30,0.7);
  color: #fff; display: flex; align-items: center; justify-content: center; font-size: 2rem;
  font-weight: 900; letter-spacing: 2px; z-index: 3; pointer-events: none; text-shadow: 1px 1px 8px #000;
`;

const ProductImage = styled.img`
  width: 100%; height: 240px; object-fit: cover; display: block; border-radius: 8px 8px 0 0;
  margin-bottom: 0.5rem; transition: transform 0.3s ease-in-out;
`;

const ProductInfo = styled.div`
  padding: 0.7rem 1rem 1.1rem 1rem; z-index: 2; display: flex; flex-direction: column;
  align-items: center; flex: 1; justify-content: flex-end;
`;

const ProductName = styled.h4`
  font-size: 1.15rem; font-weight: 600; margin: 0 0 0.3rem 0; text-align: center;
`;

const ProductPrice = styled.p`
  font-size: 1.08rem; font-weight: 600; margin: 0; color: #aaa; text-align: center;
`;

const NewBadge = styled.span`
  position: absolute; top: 0.5rem; left: 0.5rem; background-color: #4CAF50; color: white;
  font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 5px; text-transform: uppercase;
`;

const ProductCard = ({ product }) => {
  // Fix: Map to Supabase "images" array or default to placeholder
  const imagesArray = product.images || product.image || ['/favicon.png'];
  const imageUrl = Array.isArray(imagesArray) ? imagesArray[0] : imagesArray;
  
  // Fix: Map to Supabase stock check
  const isSoldOut = product.stock <= 0 || product.sold_out || product.soldOut;

  return (
    <Card
      whileHover={{ y: -5, scale: 1.05 }}
      transition={{ duration: 0.2 }}
      soldout={isSoldOut ? 1 : 0}
    >
      <Link to={`/product/${product.id}`}>
        <ProductImage src={imageUrl} alt={product.name} />
        {isSoldOut && <SoldOutOverlay>Sold Out</SoldOutOverlay>}
        {!isSoldOut && <NewBadge>NEW</NewBadge>}
        <ProductInfo>
          <ProductName>
            {isSoldOut ? <s>{product.name}</s> : product.name}
          </ProductName>
          <ProductPrice>
            {isSoldOut ? <s>₹{product.price}</s> : `₹${product.price}`}
          </ProductPrice>
        </ProductInfo>
      </Link>
    </Card>
  );
};

export default ProductCard;
