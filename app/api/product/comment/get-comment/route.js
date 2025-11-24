import dbConnect from "@/config/db";
import Comment from "@/models/Comment";
import { NextResponse } from "next/server";


export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get("productId")
        const page = searchParams.get("page")

        const limit = 10
        const skip = page * limit

        if(!productId) {
            return NextResponse.json({success: false, message: "productId required"})
        }

        await dbConnect()

        const comments = await Comment.find({productId}).limit(limit).skip(skip).populate("userId")

        console.log(comments.length)

        return NextResponse.json({success: true, comments})

    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }

}