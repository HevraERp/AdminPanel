'use server'

import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
    const supabase = createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const username = formData.get('username') as string

    // Check if the user already exists in the clients table
    const { data: existingUser, error: fetchError } = await supabase
        .from('clients')
        .select('*')
        .eq('email', email)
        .single()

    if (existingUser) {
        // If user exists, update their role to admin
        const { data: Admin, error: adminError } = await supabase
            .from('clients')
            .update({ user_role: 'admin' })
            .eq('email', email)
            .select()

        if (adminError) {
            console.error('Error adding admin role:', adminError)
            return { error: 'Error adding admin role' }
        }

        return { success: true }
    } else {
        // If user does not exist, sign them up and then add them as admin
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        })

        if (signUpError) {
            console.error('Error signing up user:', signUpError)
            return { error: 'Error signing up user' }
        }

        // Insert new user into clients table with admin role
        const { data: newAdmin, error: newAdminError } = await supabase
            .from('clients')
            .insert({
                username: username,
                email: email,
                password:password,
                user_role: 'admin'
            })
            .select()

        if (newAdminError) {
            console.error('Error adding admin role after sign up:', newAdminError)
            return { error: 'Error adding admin role after sign up' }
        }

        return { success: true }
    }
}
