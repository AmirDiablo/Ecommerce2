import { sellerAuth } from "@/lib/authSeller";
import { NextResponse } from "next/server";
import Product from "@/models/ProductModel";
import dbConnect from "@/config/db";

export async function GET(req) {
    try {
        const {_id} = await sellerAuth(req)

        if(!_id) {
            return NextResponse.json({success: false, message: "not authorized"})
        }

        await dbConnect()

        const products = await Product.find({})
        console.log(products)
        return NextResponse.json({success: true, products})
        
    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}