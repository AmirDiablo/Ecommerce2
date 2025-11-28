'use client'

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

export default function Search() {
    const { router } = useAppContext();
    const searchParams = useSearchParams();
    const q = searchParams.get("q");
    const category = searchParams.get("category");
    const price = searchParams.get("price");
    const rate = searchParams.get("rate");
    const page = parseInt(searchParams.get("page")) || 0;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState(0);

    const findResults = async () => {
        try {
            const { data } = await axios.get(
                `/api/product/search?q=${q}&category=${category}&price=${price}&rate=${rate}&page=${page}`
            );

            if (data.success) {
                setProducts(data.products);
                setCount(data.count);
                setLoading(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        findResults();
    }, [q, category, price, rate, page]);

    const handlePageChange = (index) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", index);
        router.push(`?${params.toString()}`);
        scrollTo(0, 0);
    };

    // ساخت Pagination هوشمند
    const renderPagination = () => {
        const pages = [];
        const maxVisible = 5;

        pages.push(0); // همیشه صفحه اول

        if (page > 2) pages.push("...");

        for (
            let i = Math.max(1, page - 2);
            i <= Math.min(count - 2, page + 2);
            i++
        ) {
            pages.push(i);
        }

        if (page < count - 3) pages.push("...");

        if (count > 1) pages.push(count - 1); // همیشه صفحه آخر

        return pages.map((p, index) =>
            p === "..." ? (
                <span key={index} className="px-2">...</span>
            ) : (
                <button
                    key={index}
                    onClick={() => handlePageChange(p)}
                    className={`px-3 py-2 border-[1px] border-gray-600/40 inline rounded text-center hover:cursor-pointer ${
                        page === p && "border-[2px] border-orange-600"
                    }`}
                >
                    {p + 1}
                </button>
            )
        );
    };

    return products ? (
        <>
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                <div className="flex flex-col items-end pt-12">
                    <p className="text-2xl font-medium">Results</p>
                    <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
                    {products.map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
                </div>
            </div>

            <div className="space-x-2 text-center">{renderPagination()}</div>

            <Footer />
        </>
    ) : (
        <Loading />
    );
}
