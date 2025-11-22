import dbConnect from "@/config/db"
import { sellerAuth } from "@/lib/authSeller"
import Order from "@/models/Order"
import { NextResponse } from "next/server"



export async function GET(request) {
    try {
        const user = await sellerAuth(request)

        if(!user) {
            return NextResponse.json({success: false, message: "not authorized"})
        }

        await dbConnect()

        const orders = await Order.find({}).populate("address items.product")

        return NextResponse.json({success: true, orders})

    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}