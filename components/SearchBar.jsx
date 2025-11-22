"use client"; // اگر در App Router هستی

import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const {router} = useAppContext()

  const handleSubmit = (e) => {
    e.preventDefault()
    router.push(`/search?q=${query}`)
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-stretch gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="border rounded text-black px-3 py-2 w-64 focus:outline-none focus:ring-0"
      />
      <button
        type="submit"
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        onClick={handleSubmit}
      >
        <IoSearchOutline className="text-white text-2xl" width={30} height={30} />
      </button>
    </form>
  );
}
