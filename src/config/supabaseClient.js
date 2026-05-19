import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://znqfbhmbrrkjtmujnokn.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_4tOgMlcji7DhkTNBkEyu2g_3GMcWJib';

export const supabase = createClient(supabaseUrl, supabaseKey);