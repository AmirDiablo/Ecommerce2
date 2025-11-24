import dbConnect from "@/config/db";
import Rate from "@/models/Rate";
import { NextResponse } from "next/server";


export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get("productId")

        if(!productId) {
            return NextResponse.json({success: false, message: "productId required"})
        }

        await dbConnect()

        const ratingData = await Rate.aggregate([
            {
                $match: {
                productId: productId
                }
            },
            {
                $group: {
                _id: "$productId",
                totalRating: { $sum: "$rating" },
                ratingCount: { $sum: 1 }
                }
            }
        ])

        if (ratingData.length === 0) {
            return NextResponse.json({ success: false, message: "No ratings found" });
        }

        const { totalRating, ratingCount } = ratingData[0]
        const rating = totalRating / ratingCount

        return NextResponse.json({success: true, rating: rating.toFixed(1)})

    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}