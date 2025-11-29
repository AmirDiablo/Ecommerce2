import { NextResponse } from "next/server";
import Product from "@/models/ProductModel";
import dbConnect from "@/config/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pageParam = searchParams.get("page");
    const page = Number.isInteger(Number(pageParam)) ? parseInt(pageParam, 10) : 1; // شروع از 1
    const limit = 10;
    const skip = (page - 1) * limit;

    await dbConnect();

    // تعداد کل محصولات
    const totalProducts = await Product.countDocuments({});
    const totalPages = Math.ceil(totalProducts / limit);

    // گرفتن محصولات با skip و limit
    const products = await Product.find({})
      .sort({ _id: 1 }) // مرتب‌سازی پایدار
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      products,
      totalProducts,
      totalPages,
      page,
      limit,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
