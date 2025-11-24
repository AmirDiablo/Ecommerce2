"use client"
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { IoSend } from "react-icons/io5";
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";

const Product = () => {

    const { id } = useParams();

    const { products, router, addToCart, userData } = useAppContext()

    const [mainImage, setMainImage] = useState(null);
    const [productData, setProductData] = useState(null);
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")
    const [comments, setComments] = useState([]) //i should update this list not overwrite it
    const [page, setPage] = useState(0)

    const fetchProductData = async () => {
        const product = products.find(product => product._id === id);
        setProductData(product);
    }

    const rate = async (value)=> {
        try {
            const token = userData?.token
            const {data} = await axios.post("/api/product/rating", {productId: id, rating: value}, {headers: {Authorization: `Bearer ${token}`}})

            if(data.success) {
                toast.success("Rating submitted")
                setRating(value)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const sendComment = async ()=> {
        try {
            const token = userData?.token
            const {data} = await axios.post("/api/product/comment/post-comment", {productId: id, text: comment}, {headers: {Authorization: `Bearer ${token}`}})

            if(data.success) {
                toast.success("Comment submitted")
                setComment("")
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUserRating = async ()=> {
        try {
            const token = userData?.token
            const {data} = await axios.get(`/api/user/rating?productId=${id}`, {headers: {Authorization: `Bearer ${token}`}})

            if(data.success) {
                setRating(data.rating)
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchComments = async () => {
        try {
            const {data} = await axios.get(`/api/product/comment/get-comment?productId=${id}&page=${page}`)
            if(data.success) {
                const productCommnets = [...comments, ...data.comments]
                setComments(productCommnets)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=> {
       if(userData) {
        fetchUserRating()
       }
    }, [userData])

    useEffect(()=> {
        fetchComments()
    }, [])

    useEffect(() => {
        fetchProductData();
    }, [id, products.length])

    return productData ? (<>
        <Navbar />
        <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="px-5 lg:px-16 xl:px-20">
                    <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
                        <Image
                            src={mainImage || productData.image[0]}
                            alt="alt"
                            className="w-full h-auto object-cover mix-blend-multiply"
                            width={1280}
                            height={720}
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {productData.image.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => setMainImage(image)}
                                className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
                            >
                                <Image
                                    src={image}
                                    alt="alt"
                                    className="w-full h-auto object-cover mix-blend-multiply"
                                    width={1280}
                                    height={720}
                                />
                            </div>

                        ))}
                    </div>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
                        {productData.name}
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                            <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                            <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                            <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                            <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                            <Image
                                className="h-4 w-4"
                                src={assets.star_dull_icon}
                                alt="star_dull_icon"
                            />
                        </div>
                        <p>(4.5)</p>
                    </div>
                    <p className="text-gray-600 mt-3">
                        {productData.description}
                    </p>
                    <p className="text-3xl font-medium mt-6">
                        ${productData.offerPrice}
                        <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                            ${productData.price}
                        </span>
                    </p>
                    <hr className="bg-gray-600 my-6" />
                    <div className="overflow-x-auto">
                        <table className="table-auto border-collapse w-full max-w-72">
                            <tbody>
                                <tr>
                                    <td className="text-gray-600 font-medium">Brand</td>
                                    <td className="text-gray-800/50 ">Generic</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">Color</td>
                                    <td className="text-gray-800/50 ">Multi</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">Category</td>
                                    <td className="text-gray-800/50">
                                        {productData.category}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center mt-10 gap-4">
                        <button onClick={() => addToCart(productData._id)} className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition">
                            Add to Cart
                        </button>
                        <button onClick={() => { addToCart(productData._id); router.push('/cart') }} className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition">
                            Buy now
                        </button>
                    </div>
                </div>
            </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative">
            {/* ستون سمت چپ - فرم نظر */}
            <div className="md:sticky md:top-5 md:h-fit text-center pt-10">
                <div className="md:flex md:items-center justify-between">
                <div className="flex items-center gap-0.5 md:*:h-[2vw] md:*:w-[2vw] *:w-10 *:h-10 *:hover:cursor-pointer justify-center md:order-2 mb-2">
                    <Image onClick={() => rate(1)} src={rating >= 1 ? assets.star_icon : assets.star_dull_icon} alt="star_icon" />
                    <Image onClick={() => rate(2)} src={rating >= 2 ? assets.star_icon : assets.star_dull_icon} alt="star_icon" />
                    <Image onClick={() => rate(3)} src={rating >= 3 ? assets.star_icon : assets.star_dull_icon} alt="star_icon" />
                    <Image onClick={() => rate(4)} src={rating >= 4 ? assets.star_icon : assets.star_dull_icon} alt="star_icon" />
                    <Image onClick={() => rate(5)} src={rating >= 5 ? assets.star_icon : assets.star_dull_icon} alt="star_dull_icon" />
                </div>

                <div className="md:order-1">
                    <div className="text-xl md:text-[1.5vw] font-medium mb-2">
                    <p className="font-medium text-orange-600 inline">Add Your Opinion</p> about this product
                    </div>
                </div>
                </div>

                <div className="text-center mt-7 relative">
                <textarea
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="type..."
                    className="focus:outline-none md:w-[100%] border-gray-600/40 border-2 rounded-md py-2 pr-20 px-3 h-40 w-[80%] resize-none"
                    value={comment}
                />
                <div
                    onClick={sendComment}
                    className="bg-orange-500 text-white w-max px-5 py-2 rounded-lg absolute bottom-3 right-[10.5%] md:right-1 hover:cursor-pointer"
                >
                    <IoSend />
                </div>
                </div>
            </div>

            {/* ستون سمت راست - لیست کامنت‌ها */}
            <div className="md:w-full">
                {comments.map((comment, index) => (
                <div className="border-gray-600/30 border-y-[1px] py-5" key={index}>
                    <div className="flex items-center justify-between">
                    <div className="font-[600] gap-3 flex items-center">
                        <Image
                        src={comment.userId.imageUrl}
                        width={40}
                        height={40}
                        alt="profile"
                        className="rounded-full aspect-square object-cover"
                        />
                        <p>{comment.userId.name}</p>
                        <p className="text-orange-500 font-[400]">. {comment.userId.role}</p>
                    </div>
                    <p className="text-gray-500">{new Date(comment.date).toLocaleDateString()}</p>
                    </div>

                    {comment.text}

                    <div className="flex items-center gap-2 text-2xl mt-5">
                    <AiOutlineLike /> <p className="text-[13px] -ml-1">{comment.like.length}</p>
                    <AiOutlineDislike /> <p className="text-[13px] -ml-1">{comment.dislike.length}</p>
                    </div>
                </div>
                ))}
            </div>
            </div>




            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center mb-4 mt-16">
                    <p className="text-3xl font-medium">Featured <span className="font-medium text-orange-600">Products</span></p>
                    <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
                    {products.slice(0, 5).map((product, index) => <ProductCard key={index} product={product} />)}
                </div>
                <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
                    See more
                </button>
            </div>
        </div>
        <Footer />
    </>
    ) : <Loading />
};

export default Product;