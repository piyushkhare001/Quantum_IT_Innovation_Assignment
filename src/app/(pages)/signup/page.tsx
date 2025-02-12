/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';


export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', dob: '', email: '', password: '', role: '' });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
              name: form.name,
              dob: form.dob,
              email: form.email,
              password: form.password,
              role: form.role,
        }),
      });
      console.log(form)  
      if (!response.ok) {
        // Handle non-200 responses
        toast("Failed to sign up. Please check your inputs.");
      }
      console.log(form)  
      const data: { success: boolean; message?: string } = await response.json();
      console.log(form)  
      if (data.success) {
        toast("Account created successfully!");
        setTimeout(() => {
          router.push("/signin");
        }, 5000);
      } else {
        toast(data.message || "Sign up failed.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast(error.message || "Sign up failed. Please try again.");
      } else {
        toast("Unexpected error occurred.");
      }
    } 
  };

  return (
    <>
    

    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-teal-600 to-teal-900">

    <ToastContainer/>

      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-96 text-white text-center">
        <h2 className="text-xl font-bold mb-6 text-teal-400">SIGN UP</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-teal-400"
          />
          <input
            type="date"
            name="dob"
            placeholder="Date of Birth"
            value={form.dob}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-teal-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-teal-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-teal-400"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-teal-400"
          >
            <option value="" disabled>Select Role</option>
            <option value="admin">Admin</option>
            <option value="publisher">Publisher</option>
            <option value="reviewer">Reviewer</option>
            <option value="moderator">Moderator</option>
          </select>
          <div className="flex items-end justify-end text-sm text-gray-400">
          
            <a href="/signin" className="text-teal-400 hover:underline">Have already account ?</a>

          </div>
      
          <button
            type="submit"
            className="w-full bg-teal-400 text-gray-900 font-extralight py-2 rounded-md hover:bg-teal-500 transition"
          >
            SIGN UP
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
