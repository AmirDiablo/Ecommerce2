'use client'
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);          // شروع از صفحه 1
  const [totalPages, setTotalPages] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const loaderRef = useRef(null);
  const observerRef = useRef(null);

  // گرفتن محصولات از API
  const fetchProductData = async (pageNum) => {
    try {
      setIsFetching(true);
      const { data } = await axios.get(`/api/product/list?page=${pageNum}`);
      if (data.success) {
        // دی‌دوپ بر اساس _id
        setProducts(prev => {
          const map = new Map();
          prev.forEach(p => map.set(p._id, p));
          data.products.forEach(p => map.set(p._id, p));
          return Array.from(map.values());
        });
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsFetching(false);
    }
  };

  // بارگذاری صفحه اول
  useEffect(() => {
    fetchProductData(1);
  }, []);

  // بارگذاری صفحه جدید وقتی page تغییر کند
  useEffect(() => {
    if (page > 1) {
      fetchProductData(page);
    }
  }, [page]);

  // IntersectionObserver برای تشخیص رسیدن به انتهای لیست
  useEffect(() => {
    if (!loaderRef.current) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching) {
          setPage(prev => {
            if (prev < totalPages) {
              return prev + 1;
            }
            return prev;
          });
        }
      },
      { threshold: 1 }
    );

    observerRef.current.observe(loaderRef.current);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [totalPages, isFetching]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
        <div className="flex flex-col items-end pt-12">
          <p className="text-2xl font-medium">All products</p>
          <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
        </div>

        {/* لیست محصولات */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12 pb-14 w-full">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Loader پایین صفحه */}
        <div ref={loaderRef} className="h-12 w-full flex justify-center items-center">
          {page < totalPages
            ? (isFetching ? <p className="text-gray-500">Loading...</p> : <p className="text-gray-500">Scroll to load more</p>)
            : <p className="text-gray-400">No more products</p>}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllProducts;
