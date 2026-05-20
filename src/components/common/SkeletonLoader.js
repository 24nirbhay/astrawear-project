import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { 
    opacity: 1;
  }
  50% { 
    opacity: 0.5;
  }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
  background-size: 200% 100%;
  animation: ${pulse} 2s infinite ease-in-out;
  border-radius: ${props => props.radius || '8px'};
`;

const SkeletonImage = styled(SkeletonBase)`
  width: 100%;
  height: 240px;
  border-radius: 8px 8px 0 0;
`;

const SkeletonText = styled(SkeletonBase)`
  height: ${props => props.height || '16px'};
  margin: ${props => props.margin || '0'};
  width: ${props => props.width || '100%'};
`;

const ProductCardSkeleton = () => {
  return (
    <div style={{ 
      borderRadius: '16px', 
      backgroundColor: '#1a1a1a',
      overflow: 'hidden',
      minHeight: '340px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <SkeletonImage />
      <div style={{ padding: '0.7rem 1rem 1.1rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <SkeletonText height="24px" margin="0 0 0.5rem 0" width="80%" />
        <SkeletonText height="20px" width="60%" />
      </div>
    </div>
  );
};

const ImageListSkeleton = () => {
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '1rem' }}>
      {[1, 2, 3].map((i) => (
        <SkeletonBase 
          key={i}
          style={{ width: '80px', height: '80px', borderRadius: '8px' }}
        />
      ))}
    </div>
  );
};

export { ProductCardSkeleton, SkeletonImage, SkeletonText, ImageListSkeleton };
