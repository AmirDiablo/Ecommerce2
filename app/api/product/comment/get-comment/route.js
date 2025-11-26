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

        // مثال: گرفتن کامنت‌ها مرتب‌شده بر اساس امتیاز
        const comments = await Comment.aggregate([
            {
                $match: {
                    productId: productId,
                    replyTo: null
                }
            },
            {
                $addFields: {
                score: { $subtract: [ { $size: "$like" }, { $size: "$dislike" } ] }
                }
            },
            { $sort: { score: -1, date: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $project: {
                _id: 1,
                text: 1,
                productId: 1,
                replyTo: 1,
                like: 1,
                dislike: 1,
                date: 1,
                userId: "$user" // جایگزین کردن user به جای userId
                }
            }
        ]);


        for (let i = 0; i < comments.length; i++) {
            const replies = await Comment.find({ replyTo: comments[i]._id }).populate('userId').lean();
            comments[i].replies = replies;
        }

        return NextResponse.json({success: true, comments})

    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }

}