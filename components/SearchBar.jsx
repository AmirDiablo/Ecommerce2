"use client"; // اگر در App Router هستی

import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Filter from "./Filter";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const {router, setMenuIsOpen} = useAppContext()
  const [isSearching, setIsSearching] = useState(false)

  const [category, setCategory] = useState("")
  const [price, setPrice] = useState('')
  const [rate, setRate] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setMenuIsOpen(false)
    router.push(`/search?q=${query}&category=${category}&price=${price}&rate=${rate}`)
  };

  return (
    <form onSubmit={handleSubmit} className="flex relative items-stretch gap-2">
      <input
        onFocus={() => setIsSearching(true)}   // وقتی فوکوس میشه
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

      {isSearching && <Filter setIsSearching={setIsSearching} category={category} setCategory={setCategory} price={price} setPrice={setPrice} rate={rate} setRate={setRate}  />}
    </form>
  );
}
