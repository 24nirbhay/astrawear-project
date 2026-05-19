import { supabase } from '../../config/supabaseClient';

export const getUserOrders = async (userId) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      products ( name )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getAllOrdersForAdmin = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      profiles ( username ),
      products ( name )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const updateOrderStatus = async (orderId, status) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) throw error;
  return data;
};