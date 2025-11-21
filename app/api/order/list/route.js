import dbConnect from "@/config/db"
import { requireAuth } from "@/lib/auth"
import Order from "@/models/Order"
import { NextResponse } from "next/server"


export async function GET(request) {

    try {
       const {_id} = await requireAuth(request)

        await dbConnect()

        const orders = await Order.find({userId: _id}).populate("address items.product")

        return NextResponse.json({success: true, orders})
    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
    
}