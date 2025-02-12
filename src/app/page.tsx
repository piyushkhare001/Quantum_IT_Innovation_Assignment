'use client'
import React from 'react';
import Navbar from './components/Navbar';
export default function Home() {
  return (
    <div >
      <Navbar />
      <div className="bg-white shadow-lg p-8 md:mt-56  max-sm:mt-36 rounded-lg max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          My Assignment of Quantum IT Innovation
        </h1>
        <h2 className="text-lg text-gray-600">
          To check this assignment, please{" "}
          <span className="font-semibold text-blue-500">sign up</span> first.
        </h2>
      </div>
    </div>
  );
  
}
