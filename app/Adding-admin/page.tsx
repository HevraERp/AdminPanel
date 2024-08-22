'use client'
import { signup } from './action';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';

export default function AddingAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAddingAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const response = await signup(formData);

    if (response.error) {
      setError(response.error);
    } else {
      setError(null);
      setEmail('')
      setPassword('')
      setUsername('')
    }
  };

  return (
    <Layout>
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="max-w-md w-full p-8 border border-gray-300 rounded-lg bg-white shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Add an admin</h1>
        <form className="space-y-4" onSubmit={handleAddingAdmin}>

        <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">username:</label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>


          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">password:</label>
            <input
              id="text"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>


          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
            >
              Add Admin
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 border border-red-300 rounded-md bg-red-50 text-red-700">
              <p className="text-sm">{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
    </Layout>
  );
}
