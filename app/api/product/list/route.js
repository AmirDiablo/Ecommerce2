import { NextResponse } from "next/server";
import Product from "@/models/ProductModel";
import dbConnect from "@/config/db";

export async function GET(req) {
    try {

        await dbConnect()

        const products = await Product.find({})
        return NextResponse.json({success: true, products})
        
    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}