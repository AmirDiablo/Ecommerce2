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

        const comments = await Comment.find({ productId, replyTo: null })
        .limit(limit)
        .skip(skip)
        .populate("userId")
        .lean(); // خروجی plain object می‌دهد

        for (let i = 0; i < comments.length; i++) {
            const replies = await Comment.find({ replyTo: comments[i]._id }).populate('userId').lean();
            comments[i].replies = replies;
        }

        return NextResponse.json({success: true, comments})

    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }

}