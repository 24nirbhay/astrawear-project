import { supabase } from '../config/supabaseClient';

export const getUserOrders = async (userId) => {
  // Fetches orders and joins the product details automatically
  const { data, error } = await supabase
    .from('orders')
    .select('*, products(name, price, images)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const getAllOrdersForAdmin = async () => {
  // Fetches all orders and joins both product and user profile details
  const { data, error } = await supabase
    .from('orders')
    .select('*, profiles(username), products(name, price)')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const updateOrderStatus = async (orderId, newStatus) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);
    
  if (error) throw error;
  return data;
};
