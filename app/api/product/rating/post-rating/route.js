import dbConnect from "@/config/db";
import { requireAuth } from "@/lib/auth";
import Rate from "@/models/Rate";
import { NextResponse } from "next/server";
import Product from "@/models/ProductModel";

export async function POST(request) {
    try {
        const {_id} = await requireAuth(request)
        const { productId, rating } = await request.json()

        if(!productId || !rating) {
            return NextResponse.json({success: false, message: "productId and rating are required"})
        }

        await dbConnect()

        const voted = await Rate.findOne({userId: _id, productId})

        if(voted) {
            const updataRate = await Rate.updateOne({userId: _id, productId}, {$set: {rating}})
        }else{
            const rate = await Rate.create({userId: _id, productId, rating}) 
        }

        const productRateInfo = await Product.findOne({_id: productId})
        const productRate = productRateInfo.rate
        const productRateCount = productRateInfo.rateCount
        const sumRates = await Rate.aggregate([
            {
                $match: {productId: productId}
            },
            {
                $group: {
                _id: "$productId",
                totalRating: { $sum: "$rating" },
                }
            }
        ])

        const { totalRating } = sumRates[0]

        const newRate = totalRating / (productRateCount+1)

        const updateProduct = await Product.updateOne({_id: productId}, {rate: newRate, rateCount: productRateCount+1})

        return NextResponse.json({success: true, message: "Rating submitted successfully"})

    } catch (error) {
        return NextResponse.json({success: false, message: "something went wrong..."})
    }
}