import { products } from "@/assets/productData";
import dbConnect from "@/config/db";
import Product from "@/models/ProductModel";
import { NextResponse } from "next/server";


export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get("q")?.toLowerCase() || "";

        await dbConnect()

        const products = await Product.find({ $text: { $search: q } })

        return NextResponse.json({success: true, products})
    } catch (error) {
        return NextResponse.json({success: false, message: "something went wrong..."})
    }
}