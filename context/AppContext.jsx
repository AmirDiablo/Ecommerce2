'use client'
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()

    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const [favList, setFavList] = useState([])
    const [menuIsOpen, setMenuIsOpen] = useState(false)
    const [pageCount, setPageCount] = useState(0)

    const fetchProductData = async (page) => {
        try {
            const {data} = await axios.get(`/api/product/list`)

            if(data.success) {
                setProducts(data.products);
                setPageCount(data.count)
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUserData = async () => {
        try {
            const data = JSON.parse(localStorage?.getItem("user"))
            const response = await fetch(`/api/user/userInfo/${data?.id}`)
            const json = await response.json()

            if(json.role === "seller") {
                setIsSeller(true)
            }

            let obj = json
            obj.token = data?.token
            
            if(response.ok) {
                setUserData(obj)
                setCartItems(json.cartItems)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const addToCart = async (itemId) => {
        let cartData = structuredClone(cartItems || {});

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        }
        else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);

        toast.success("Item added to cart")

        if(userData) {

            try {
                const token = userData.token
                const {data} = await axios.post("/api/cart/update", {cartData} , {headers: {Authorization: `Bearer ${token}`}})
                toast.success("Item added to cart")
            } catch (error) {
                toast.error(error.message)
            }
        }
    }

    const updateCartQuantity = async (itemId, quantity) => {

        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)

        if(userData) {
            try {
                const token = userData.token
                const {data} = await axios.post("/api/cart/update", {cartData} , {headers: {Authorization: `Bearer ${token}`}})
                toast.success("Cart updated")
            } catch (error) {
                toast.error(error.message)
            }
        }

    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0) {
                totalAmount += itemInfo?.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    const fetchFav = async ()=> {
        const token = userData?.token
        const {data} = await axios.get("/api/fav/fav-list", {headers: {Authorization: `Bearer ${token}`} })

        if(data.success) {
            setFavList(data.list)
        }
    }

    useEffect(() => {
        fetchProductData()
    }, [])

    useEffect(() => {
        fetchUserData()
    }, [])

    useEffect(()=> {
        if(userData) {
            fetchFav()
        }
    }, [userData])

    const value = {
        currency, router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount,
        setUserData, setFavList,
        favList, setMenuIsOpen,
        menuIsOpen, setPageCount, 
        pageCount,
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}