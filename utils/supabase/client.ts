// utils/supabase/client.js
import { createBrowserClient } from '@supabase/ssr';

// Use environment variables with default values to avoid undefined errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createBrowserClient(supabaseUrl, supabaseKey);

export { supabase };