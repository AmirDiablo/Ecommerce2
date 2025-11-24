import dbConnect from "@/config/db";
import { requireAuth } from "@/lib/auth";
import Comment from "@/models/Comment";
import { NextResponse } from "next/server";


export async function POST(request) {
    try {
        const {_id} = await requireAuth(request)
        const {commentId} = await request.json()

        if(!commentId) {
            return NextResponse.json({success: false, message: "commentId required"})
        }

        await dbConnect()

        const exist = await Comment.findOne({_id: commentId, like: {$in : [_id]}})
        const existInDislikes = await Comment.findOne({_id: commentId, dislike: {$in : [_id]}})

        if(existInDislikes) {
            const undislike = await Comment.updateOne({_id: commentId}, {$pull: {dislike: _id}})
        }

        if(!exist) {
            const like = await Comment.updateOne({_id: commentId}, {$push: {like: _id}})
        }else{
            const unlike = await Comment.updateOne({_id: commentId}, {$pull: {like: _id}})
        }

        return NextResponse.json({success: true, message: "like sumbitted"})

    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}