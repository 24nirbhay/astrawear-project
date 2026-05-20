import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '../../config/supabaseClient';
import toast from 'react-hot-toast';

const Container = styled.div`
  background: #1e293b;
  padding: 25px;
  border-radius: 12px;
  color: white;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const FormBox = styled.form`
  background: #0f172a;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  border: 1px solid #334155;
`;

const Input = styled.input`
  background: #1e293b;
  color: white;
  border: 1px solid #475569;
  padding: 10px;
  border-radius: 6px;
  width: 100%;
  box-sizing: border-box;
`;

const Select = styled.select`
  background: #1e293b;
  color: white;
  border: 1px solid #475569;
  padding: 10px;
  border-radius: 6px;
  width: 100%;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #60519b, #8e7ce8);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td { padding: 12px; text-align: left; border-bottom: 1px solid #334155; }
  th { color: #94a3b8; }
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
`;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const initialFormState = {
    name: '',
    price: '',
    description: '',
    category: 'Streetwear',
    brand: 'Astrawear',
    size: 'M',
    stock: 1
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error) setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct && !file) return toast.error('Please upload an image for a new product.');
    if (!formData.name || !formData.price) return toast.error('Name and Price are required.');

    setIsUploading(true);
    let imageUrl = editingProduct?.images[0] || '';

    try {
      if (file) {
        // 1. Upload Image to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file);
        
        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
        imageUrl = publicUrl;
      }

      const productData = {
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          category: formData.category,
          brand: formData.brand,
          size: formData.size,
          stock: parseInt(formData.stock),
          images: [imageUrl]
      };

      if (editingProduct) {
        // Update existing product
        const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
        if (error) throw error;
        toast.success('Product updated successfully!');
      } else {
        // Insert new product
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
        toast.success('Product added successfully!');
      }

      handleCancelEdit();
      fetchProducts(); // Refresh list

    } catch (error) {
      toast.error(error.message || `Failed to ${editingProduct ? 'update' : 'add'} product`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      price: product.price || '',
      description: product.description || '',
      category: product.category || 'Streetwear',
      brand: product.brand || 'Astrawear',
      size: product.size || 'M',
      stock: product.stock || 0,
    });
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setFile(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete product');
    } else {
      toast.success('Product deleted');
      fetchProducts();
    }
  };

  return (
    <Container>
      {/* Upload Form */}
      <div>
        <h3 style={{ marginTop: 0 }}>{editingProduct ? 'Edit Drop' : 'Add New Drop'}</h3>
        <FormBox onSubmit={handleSubmit}>
          <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} key={file ? 'file-selected' : 'no-file'} />
          <Input name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
          <Input name="price" type="number" placeholder="Price (₹)" value={formData.price} onChange={handleChange} required />
          <Select name="category" value={formData.category} onChange={handleChange}>
            <option value="Streetwear">Streetwear</option>
            <option value="Vintage">Vintage Thrift</option>
            <option value="Accessories">Accessories</option>
          </Select>
          <Input name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} />
          <Select name="size" value={formData.size} onChange={handleChange}>
            <option value="S">Small (S)</option>
            <option value="M">Medium (M)</option>
            <option value="L">Large (L)</option>
            <option value="XL">Extra Large (XL)</option>
            <option value="OS">One Size</option>
          </Select>
          <Input name="stock" type="number" placeholder="Initial Stock" value={formData.stock} onChange={handleChange} min="1" required />
          <div style={{ display: 'flex', gap: '10px' }}>
            {editingProduct && <Button type="button" onClick={handleCancelEdit} style={{ background: '#475569' }}>Cancel</Button>}
            <Button type="submit" disabled={isUploading}>
              {isUploading 
                ? (editingProduct ? 'Updating...' : 'Uploading...') 
                : (editingProduct ? 'Update Product' : 'Publish Product')}
            </Button>
          </div>
        </FormBox>
      </div>

      {/* Inventory List */}
      <div style={{ overflowX: 'auto' }}>
        <h3 style={{ marginTop: 0 }}>Current Inventory</h3>
        <Table>
          <thead>
            <tr>
              <th>Img</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td><ProductImage src={p.images[0] || '/favicon.png'} alt={p.name} /></td>
                <td>{p.name}</td>
                <td>₹{p.price}</td>
                <td style={{ color: p.stock <= 0 ? '#ff4d4d' : '#16a34a' }}>
                  {p.stock > 0 ? p.stock : 'Sold Out'}
                </td>
                <td>
                  <button 
                    onClick={() => handleEdit(p)}
                    style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan="5">No products uploaded yet.</td></tr>}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default ProductManagement;
