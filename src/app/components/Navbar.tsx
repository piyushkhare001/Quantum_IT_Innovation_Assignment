/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";


import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";

const Navbar: React.FC = () => {
  const { data: session } = useSession();

  // Framer Motion variants for the toggle menu

  const handleLogout = () => {
    signOut({ callbackUrl: window.location.origin});
    toast("logged out !!");
  };

  return (
    <nav className="bg-white shadow-md fixed z-50 w-full  top-0 left-0 h-16">
      <ToastContainer />

      <div className="    flex justify-between   md:mx-10 max-sm:mx-2 items-center h-16">
        {/* Logo */}

        <div>
          <Link href="/">
            <h1 className=" font-bold md:text-2xl  max-sm:text-lg  mt-1 text-black hover:text-gray-800">
              Assignment
            </h1>
          </Link>
        </div>
    

        {session ? (
          <button
            onClick={handleLogout}
            className="bg-black text-gray-100 text-center font-semibold py-3 px-6  md:w-44 max-sm:w-24  hover:bg-zinc-950"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/signin"
            className="bg-black text-gray-100 text-center font-semibold py-3 px-6  md:w-44 max-sm:w-24  hover:bg-zinc-950"
          >
            SignIn
          </Link>
        )}
</div>
    </nav>
  );
};

export default Navbar;
