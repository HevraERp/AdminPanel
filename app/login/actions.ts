'use server'
import { createClient } from '@/utils/supabase/server'


export async function login(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

 
  const { data: user, error: signInError } = await supabase.auth.signInWithPassword(data)

  if (signInError || !user.user) {
    return { error: "You don't have an account" }
  }

  const { data: userRoles, error: roleError } = await supabase
    .from('clients')
    .select('user_role')
    .eq('email', user.user.email)
    .single()

  if (roleError) {
    return { error: 'Error fetching user role' }
  }
  if (userRoles?.user_role === 'admin') {
    return { success: true }
  } else {
    return { error: 'You are not an admin' }
  }
}
