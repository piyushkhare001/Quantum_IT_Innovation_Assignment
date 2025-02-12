/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import { useSession } from 'next-auth/react';



export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
 const router = useRouter();
 const{data : session} = useSession()



 
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (session) {
      toast.warn(`You are already logged in as ${session?.user?.name}`);
    }
    e.preventDefault();

  
    try {
      const result = await signIn("sign-in", {
        email: form.username,
        password: form.password,
       
        redirect: false,
      });
  
      if (result?.error) {
        // Show the error message from the API
        toast.error(result.error);
        return;
      }
  
      toast.success("Successfully logged in!!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Sign-in error:", error);
      toast.error("An error occurred during sign-in.");
    } 
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-teal-600 to-teal-900">
        <ToastContainer/>
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-96 text-white text-center">
        <h2 className="text-xl font-bold mb-6 text-teal-400">SIGN IN</h2>
        <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
          <span className="text-4xl">👤</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              name="username"
              placeholder=" your email"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-teal-400"
            />
          </div>
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-teal-400"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <a href="/signup" className="text-teal-400 hover:underline">Create new account</a>
          </div>
          <button
            type="submit"
            className="w-full bg-teal-400 text-gray-900 font-extralight py-2 rounded-md hover:bg-teal-500 transition"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
}
