"use client"

import { useAppContext } from "@/context/AppContext"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import ProductCard from "@/components/ProductCard"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"


export default function Fav() {
    const {userData, favList} = useAppContext()
    const [loading, setLoading] = useState(true)
    const [list, setList] = useState([])

    const fetchFavs = async () => {
        try {
            const token = userData?.token
            const {data} = await axios.get("/api/fav/fav-list2", {headers: {Authorization: `Bearer ${token}`}})

            if(data.success) {
                setList(data.list)
                setLoading(false)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=> {
        if(userData) {
            fetchFavs()
        }
    }, [userData])

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                <div className="flex flex-col items-end pt-12">
                    <p className="text-2xl font-medium">My Favs</p>
                    <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
                    {list.map((product, index) => favList.includes(product._id) && <ProductCard key={index} product={product} />)}
                </div>
            </div>
            <Footer />
        </>
    )
}