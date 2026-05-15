import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://znqfbhmbrrkjtmujnokn.supabase.co';
const supabaseKey = 'sb_publishable_4tOgMlcji7DhkTNBkEyu2g_3GMcWJib';

export const supabase = createClient(supabaseUrl, supabaseKey);