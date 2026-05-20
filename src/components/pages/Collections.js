import React from 'react';
import styled from 'styled-components';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaTags } from 'react-icons/fa6';
import { useProducts } from '../../hooks/useProducts';

const PageContainer = styled.div`
  padding: 80px 2rem 2rem;
  background-color: #121212;
  min-height: 100vh;
  @media (max-width: 600px) {
    padding: 80px 1rem 2rem 1rem;
  }
`;

const Title = styled.h1`
  font-size: 3rem; text-align: center; margin-bottom: 2rem;
`;

const ProductGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem;
`;

const BackButton = styled(Link)`
  display: inline-flex; align-items: center; gap: 0.5rem; color: #fff; font-size: 1.5rem;
  margin-bottom: 2rem; text-decoration: none; background: none; border: none; cursor: pointer;
  transition: transform 0.2s ease-in-out;
  &:hover { transform: scale(1.1); }
`;

const Collections = () => {
  const { products, loading, error } = useProducts();

  return (
    <PageContainer>
      <BackButton to="/">
        <FaArrowLeft /> Back
      </BackButton>
      <Title><FaTags style={{ fontSize: '2.2rem', marginRight: '10px', color: '#ffcc00' }}/> All Products</Title>
      {loading && <p style={{ color: '#fff', textAlign: 'center' }}>Loading products...</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}
      {!loading && !error && (
        <ProductGrid>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductGrid>
      )}
    </PageContainer>
  );
};

export default Collections;
