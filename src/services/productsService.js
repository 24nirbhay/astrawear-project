import { supabase } from '../config/supabaseClient';

export const getProducts = async (filters = {}) => {
  let query = supabase.from('products').select('*');

  // Apply basic filtering if needed
  if (filters.category) query = query.eq('category', filters.category);
  if (filters.sold_out !== undefined) query = query.eq('sold_out', filters.sold_out);

  // Order by newest first
  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getProductById = async (id) => {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};
