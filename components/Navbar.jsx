"use client"
import React, { useState } from "react";
import { assets} from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import SignUp from "./SignUp";
import Login from "./Login"

const Navbar = () => {

  const { isSeller, router, userData } = useAppContext();
  const [isOpen, setIsOpen] = useState(false)
  const [loginisOpen, setLoginisOpen] = useState(false);
  const [signUpisOpen, setSignUpisOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          Shop
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          About Us
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          Contact
        </Link>

        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Seller Dashboard</button>}

      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        {userData ?
          <Image src={userData.imageUrl} alt="profile image" width={40} height={40} className="rounded-full cursor-pointer" />
        :
          <button onClick={()=> {setIsOpen(true), setSignUpisOpen(true)}} className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        }
      </ul>

      {signUpisOpen && <SignUp setLoginisOpen={setLoginisOpen} setSignUpisOpen={setSignUpisOpen} />}
      {signUpisOpen ? <div className="bg-black/50 w-screen h-screen fixed top-0 bottom-0 left-0 right-0 z-40"></div> : null }

      {loginisOpen && <Login setLoginisOpen={setLoginisOpen} setSignUpisOpen={setSignUpisOpen} />}
      {loginisOpen ? <div className="bg-black/50 w-screen h-screen fixed top-0 bottom-0 left-0 right-0 z-40"></div> : null }

      <div className="flex items-center md:hidden gap-3">
        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Seller Dashboard</button>}
        <button className="flex items-center gap-2 hover:text-gray-900 transition">
          <Image src={assets.user_icon} alt="user icon" />
          Account
        </button>
      </div>
    </nav>
  );
};

export default Navbar;