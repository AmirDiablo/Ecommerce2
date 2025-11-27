'use client'

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";


export default function Search() {
    /* const router = useRouter()
    const {category, price, rate} = router.query */
    const searchParams = useSearchParams();
    const q = searchParams.get("q");
    const category = searchParams.get("category");
    const price = searchParams.get("price");
    const rate = searchParams.get("rate");
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    const findResults = async ()=> {
        try {
            const {data} = await axios.get(`/api/product/search?q=${q}&category=${category}&price=${price}&rate=${rate}`)

            if(data.success) {
                setProducts(data.products)
                setLoading(false)
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=> {
        findResults()
    }, [q, category, price, rate])

    return products ? (
        <>
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                <div className="flex flex-col items-end pt-12">
                    <p className="text-2xl font-medium">Results</p>
                    <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
                    {products.map((product, index) => <ProductCard key={index} product={product} />)}
                </div>
            </div>
            <Footer />
        </>
        
    ) : <Loading />
}