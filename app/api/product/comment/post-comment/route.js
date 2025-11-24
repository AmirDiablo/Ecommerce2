import dbConnect from "@/config/db";
import Comment from "@/models/Comment";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";


export async function POST(request) {
    try {
        const {_id} = await requireAuth(request)
        const { productId, text } = await request.json()

        if(!productId || !text) {
            return NextResponse.json({success: false, message: "productId and text are required"})
        }

        await dbConnect()

        const postComment = await Comment.create({userId: _id, productId, text, date: Date.now()})
        const comment = await Comment.findOne({_id: postComment._id}).populate("userId")

        console.log(comment)
        
        return NextResponse.json({success: true, comment, message: "Comment submitted successfully"})

    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}