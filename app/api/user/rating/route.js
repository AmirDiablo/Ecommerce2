import dbConnect from "@/config/db";
import { requireAuth } from "@/lib/auth";
import Rate from "@/models/Rate";
import { NextResponse } from "next/server";


export async function GET(request) {
    try {
        const {_id} = await requireAuth(request)
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get("productId")

        if(!productId) {
            return NextResponse.json({success: false, message: "productId required"})
        }
        
        await dbConnect()

        const ratingDoc = await Rate.findOne({userId: _id, productId})
        const rating = ratingDoc?.rating || 0

        return NextResponse.json({success: true, rating:rating})

    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}