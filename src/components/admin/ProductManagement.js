import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTrash, FaUpload, FaCheck, FaExclamationCircle } from 'react-icons/fa';
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
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #60519b;
  }
`;

const Select = styled.select`
  background: #1e293b;
  color: white;
  border: 1px solid #475569;
  padding: 10px;
  border-radius: 6px;
  width: 100%;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #60519b;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #60519b, #8e7ce8);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(96, 81, 155, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ImageUploadBox = styled.div`
  border: 2px dashed #475569;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #1a2a3a;

  &:hover {
    border-color: #60519b;
    background: #1e2f3f;
  }

  input {
    display: none;
  }
`;

const ImagePreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
  margin-top: 10px;
`;

const ImagePreview = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  background: #1a2a3a;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #334155;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  button {
    position: absolute;
    top: 2px;
    right: 2px;
    background: #ef4444;
    color: white;
    border: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    opacity: 0;
    transition: opacity 0.2s;

    &:hover {
      background: #dc2626;
    }
  }

  &:hover button {
    opacity: 1;
  }
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => props.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
  color: ${props => props.type === 'success' ? '#10b981' : '#ef4444'};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td { 
    padding: 12px; 
    text-align: left; 
    border-bottom: 1px solid #334155; 
  }
  th { 
    color: #94a3b8;
    background: #0f172a;
    font-weight: 600;
  }

  tr:hover {
    background: #0f172a;
  }
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
`;

const ActionButton = styled.button`
  background: ${props => props.danger ? '#ef4444' : '#3b82f6'};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
  font-size: 0.85rem;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }
`;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
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

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Validate file size (max 5MB per file)
    const validFiles = selectedFiles.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    setFiles([...files, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setFilePreviews(filePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct && files.length === 0) return toast.error('Please upload at least one image.');
    if (!formData.name || !formData.price) return toast.error('Name and Price are required.');

    setIsUploading(true);
    let imageUrls = editingProduct?.images || [];

    try {
      // Upload new images
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);
        
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        
        imageUrls.push(publicUrl);
      }

      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        brand: formData.brand,
        size: formData.size,
        stock: parseInt(formData.stock),
        images: imageUrls
      };

      if (editingProduct) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
        if (error) throw error;
        toast.success('Product updated successfully!');
      } else {
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
        toast.success('Product added successfully!');
      }

      handleCancelEdit();
      fetchProducts();

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
    setFiles([]);
    setFilePreviews([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setFiles([]);
    setFilePreviews([]);
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
          <ImageUploadBox>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              id="image-upload"
            />
            <label htmlFor="image-upload" style={{ cursor: 'pointer', display: 'block' }}>
              <FaUpload style={{ marginBottom: '8px', fontSize: '1.5rem' }} />
              <div>Click to upload images (up to 5MB each)</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                {files.length > 0 && `${files.length} image(s) selected`}
              </div>
            </label>
          </ImageUploadBox>

          {filePreviews.length > 0 && (
            <ImagePreviewGrid>
              {filePreviews.map((preview, idx) => (
                <ImagePreview key={idx}>
                  <img src={preview} alt={`Preview ${idx + 1}`} />
                  <button type="button" onClick={() => removeImage(idx)}>✕</button>
                </ImagePreview>
              ))}
            </ImagePreviewGrid>
          )}

          <Input name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
          <Input name="price" type="number" placeholder="Price (₹)" value={formData.price} onChange={handleChange} required />
          <Input name="description" placeholder="Description (optional)" value={formData.description} onChange={handleChange} />
          
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
            {editingProduct && (
              <Button type="button" onClick={handleCancelEdit} style={{ background: '#475569', flex: 1 }}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isUploading} style={{ flex: editingProduct ? 2 : 1 }}>
              <FaCheck />
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
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Images</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td><ProductImage src={p.images?.[0] || '/favicon.png'} alt={p.name} /></td>
                <td>{p.name}</td>
                <td>₹{p.price}</td>
                <td>
                  <StatusBadge type={p.stock > 0 ? 'success' : 'error'}>
                    {p.stock > 0 ? <FaCheck /> : <FaExclamationCircle />}
                    {p.stock > 0 ? p.stock : 'Sold Out'}
                  </StatusBadge>
                </td>
                <td style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  {p.images?.length || 1} {p.images?.length === 1 ? 'image' : 'images'}
                </td>
                <td>
                  <ActionButton onClick={() => handleEdit(p)}>
                    Edit
                  </ActionButton>
                  <ActionButton danger onClick={() => handleDelete(p.id)}>
                    <FaTrash /> Delete
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default ProductManagement;
export default ProductManagement;
