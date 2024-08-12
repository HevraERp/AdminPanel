"use client";
import Nav from "./Nav";
import Logo from "./Logo";
import "@/app/globals.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";


export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  function signInWithGoogle() {
    signIn('google'); 
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;
  
    const result = await signIn('credentials', {
      email,
      password,
    });

    if (result.error) {
      console.error(result.error);
    } else {
      router.push('/'); 
    }
  }



  if (!session) {
    return (
      <div className="bg-gray-200 w-screen h-screen flex items-center justify-center">
        <div className="p-6 bg-white rounded-lg shadow-2xl max-w-sm w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
       <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4"
            >
              Login
            </button>
          </form>
          <div className="text-center">
            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full bg-blue-700 text-white py-2 px-4 rounded-md shadow hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Login with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen ">
      <div className="block md:hidden flex items-center p-4">
        <button onClick={() => setShowNav(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
      </div>
      <div className="flex">
        <Nav show={showNav} />
        <div className="flex-grow p-4">{children}</div>
      </div>
    </div>
  );
}
