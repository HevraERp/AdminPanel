'use client'

import { useRouter } from 'next/navigation';

export default function ErrorPage() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/login'); // Assuming your login page is at /login
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold text-gray-700 mb-4">Oops!</h1>
        <p className="text-gray-600 mb-8">Check your password and email</p>
        <button
          onClick={handleRedirect}
          className="py-2 px-4 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
        >
          Go to Login Page
        </button>
      </div>
    </div>
  );
}
