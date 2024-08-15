import { createClient } from '@supabase/supabase-js';

const supabase_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabase_Key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabase_URL || !supabase_Key) {
  console.log('Missing Supabase URL or Key');
}

const supabase = createClient(supabase_URL, supabase_Key);


export default supabase;