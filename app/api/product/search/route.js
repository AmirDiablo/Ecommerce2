import { products } from "@/assets/productData";
import dbConnect from "@/config/db";
import Product from "@/models/ProductModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.toLowerCase() || "";
    const category = searchParams.get("category");
    const price = searchParams.get("price");
    const rate = searchParams.get("rate");
    const page = searchParams.get("page") || 0;

    const limit = 10;
    const skip = page * limit

    await dbConnect();

    const query = {};

    if (q) {
      query.$text = { $search: q };
    }

    if (category) {
      query.category = category;
    }

    if (price) {
      query.offerPrice = { $lte: parseFloat(price) }; // تبدیل به عدد اعشاری
    }

    if (rate) {
      query.rate = { $gte: parseFloat(rate) };
    }

    const products = await Product.find(query).skip(skip).limit(limit)
    const numberOfResults = await Product.countDocuments(query)

    const filledPages = numberOfResults / limit
    const count = Math.ceil(filledPages)

    return NextResponse.json({ success: true, products, count: count });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}


