// Centralized taxonomy for categories/labels
// Keep names short and on-brand; used in pills/tags

export const CATEGORIES = [
  'Unisex • Tees',
  'Unisex • Jackets',
  'Unisex • Hoodies',
  'Men • Tees',
  'Men • Jackets',
  'Women • Tops',
  'Women • Accessories',
  'Deals',
  'New Drops',
];

export const normalizeCategory = (product) => {
  // Try to infer from product fields; fallbacks to 'Unisex • Tees'
  const raw = (product?.category || '').toLowerCase();
  if (raw.includes('hood')) return 'Unisex • Hoodies';
  if (raw.includes('jacket') || product?.name?.toLowerCase().includes('jacket')) return 'Unisex • Jackets';
  if (raw.includes('deal')) return 'Deals';
  if (raw.includes('access')) return 'Women • Accessories';
  return 'Unisex • Tees';
};
