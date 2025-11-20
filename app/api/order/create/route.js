import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import Product from "@/models/ProductModel";
import Order from "@/models/Order";
import User from "@/models/UserModel";


export async function POST(request) {
    try {
        const {_id} = await requireAuth(request)

        const {items, address} = await request.json()

        if(!address || items.length === 0) {
            return NextResponse.json({success: false, message: "Invalid data"})
        }

        const amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product)
            return await acc + product.offerPrice * item.quantity
        }, 0)

        const order = await Order.create({
            userId: _id,
            items,
            address,
            amount: Math.floor(amount * 0.02),
            date: Date.now()
        })

        //clear cart
        const user = await User.findById(_id)
        user.cartItems = {}
        await user.save()

        return NextResponse.json({success: true, message: "Order placed successfully"})

    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}