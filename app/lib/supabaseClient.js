import { createClient } from '@supabase/supabase-js';

const supabase_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabase_Key = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabase_URL || !supabase_Key) {
  console.log('Missing Supabase URL or Key');
}

const supabase = createClient(supabase_URL, supabase_Key);


// Sign in to Supabase
const signIn = async (email, password) => {
  const { error: authError } = await supabase.auth.signInWithPassword({
     email: 'lidamahamad7@gmail.com',
     password: 'database$#128'
  });

  if (authError) {
    console.error('Error signing in:', authError);
  } else {
    console.log('Successfully signed in');
  }
};


export default supabase;
