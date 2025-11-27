"use client"
import React, { useState } from "react";
import { assets} from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import SignUp from "./SignUp";
import Login from "./Login"
import UserButton from "./UserButton";
import { RxCross1 } from "react-icons/rx";
import { CiMenuFries } from "react-icons/ci";
import SearchBar from "./SearchBar";

export default function Navbar () {

  const { isSeller, router, userData, menuIsOpen, setMenuIsOpen } = useAppContext();
  const [isOpen, setIsOpen] = useState(false)
  /* const [menuIsOpen, setMenuIsOpen] = useState(false) */
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

      <div className={`max-md:fixed max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur max-md:text-white bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${menuIsOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>

          <RxCross1 onClick={()=> setMenuIsOpen(false)} className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer" />

         <div className="md:hidden">
            <SearchBar />
         </div>

          <Link onClick={()=> setMenuIsOpen(false)} href="/" className="hover:text-gray-900 transition">
            Home
          </Link>
          <Link onClick={()=> setMenuIsOpen(false)} href="/all-products" className="hover:text-gray-900 transition">
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
        <SearchBar />
        {userData ?
          <Image onClick={()=> setIsOpen(!isOpen)} src={userData.imageUrl} alt="profile image" width={40} height={40} className="rounded-full cursor-pointer" />
        :
          <button onClick={()=> {setSignUpisOpen(true)}} className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        }

        {isOpen && <UserButton setIsOpen={setIsOpen} />}
      </ul>

      {signUpisOpen && <SignUp setLoginisOpen={setLoginisOpen} setSignUpisOpen={setSignUpisOpen} />}
      {signUpisOpen ? <div className="bg-black/50 w-screen h-screen fixed top-0 bottom-0 left-0 right-0 z-40"></div> : null }

      {loginisOpen && <Login setLoginisOpen={setLoginisOpen} setSignUpisOpen={setSignUpisOpen} />}
      {loginisOpen ? <div className="bg-black/50 w-screen h-screen fixed top-0 bottom-0 left-0 right-0 z-40"></div> : null }

      <div className="flex items-center md:hidden gap-3">
        
        {userData ?
          <Image onClick={()=> setIsOpen(!isOpen)} src={userData.imageUrl} alt="profile image" width={40} height={40} className="rounded-full cursor-pointer" /> :
          <button onClick={()=> {setSignUpisOpen(true)}} className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>}

          <CiMenuFries onClick={()=> setMenuIsOpen(!menuIsOpen)} className="text-2xl md:hidden  cursor-pointer" />

          {isOpen && <UserButton setIsOpen={setIsOpen} />}
      </div>
    </nav>
  );
};