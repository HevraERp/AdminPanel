'use client'
import { useState } from 'react'
import { supabase } from "@/utils/supabase/client";
import { type User } from '@supabase/supabase-js'

export default function AccountForm({ user }: { user: User | null }) {
  
  const [email, setEmail] = useState<string | null>(user?.email || '')

  async function updateProfile({ email }: { email: string | null }) {
    try {
      const { error } = await supabase.auth.updateUser({
        email: email as string,
      })

      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
    }
  }

  return (
    <div className="form-widget mt-8">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          value={email || ''}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <button
          className="btn-primary  block"
          onClick={() => updateProfile({ email })}
        >
          Update Email
        </button>
      </div>
    </div>
  )
}
