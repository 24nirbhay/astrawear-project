// useProducts Hook - Fetch and manage products data
// TODO: Replace with React Query or SWR for better caching and state management

import { useState, useEffect } from 'react';
import { getProducts, getProductById } from '../services/productsService';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        // TODO: This will fetch from MongoDB via productsService
        const data = await getProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error loading products:', err);
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const refreshProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error refreshing products:', err);
      setError(err.message || 'Failed to refresh products');
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    refreshProducts,
  };
};

export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // TODO: This will fetch from MongoDB via productsService
        const data = await getProductById(Number(productId));
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error('Error loading product:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  return {
    product,
    loading,
    error,
  };
};

export default useProducts;
