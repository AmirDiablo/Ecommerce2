"use client";

import { useState } from "react";
import Link from "next/link";
import { RxCross1 } from "react-icons/rx";
import GoogleButton from "./GoogleButton";
import { useAppContext } from "@/context/AppContext";

export default function Login({ setLoginisOpen, setSignUpisOpen }) {
  const {fetchUserData} = useAppContext()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(json));
        fetchUserData();
        setLoginisOpen(false);
      } else {
        console.error("Login failed:", json.error);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="bg-white text-black rounded-2xl p-8 flex flex-col gap-6 w-[350px] max-sm:w-[90%] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
      <RxCross1
        onClick={() => setLoginisOpen(false)}
        className="w-5 h-5 cursor-pointer absolute top-4 right-4 text-black/40"
      />

      <p className="text-center font-[600]">Log in to QuickShow</p>
      <p className="text-black/40 text-[15px] text-center">
        Welcome back! please Log in to continue
      </p>
      <div className="mx-auto">
        <GoogleButton setLoginisOpen={setLoginisOpen} />
      </div>

      <div className="h-[1px] bg-black/20 w-[100%]"></div>
      <p className="text-black/40 text-center">or</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label className="text-[15px]">Email address</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="enter your email address"
          className="border-[1px] border-black/40 py-1 px-2 rounded-[7px] w-[100%] mb-2"
        />

        <label className="text-[15px]">Password</label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="enter your account password"
          className="border-[1px] border-black/40 py-1 px-2 rounded-[7px] w-[100%]"
        />

        <button
          type="submit"
          className="bg-black/80 cursor-pointer text-white rounded-[7px] py-1 mt-2"
        >
          Log in
        </button>
      </form>

      <div className="text-center flex items-center justify-center gap-2">
        <p className="text-black/40 text-[15px]">Don't have an account?</p>
        <p
          href="#"
          onClick={() => {
            setSignUpisOpen(true);
            setLoginisOpen(false);
          }}
          className="text-blue-600 cursor-pointer"
        >
          Sign up
        </p>
      </div>
    </div>
  );
}
