// lib/auth.js
import jwt from "jsonwebtoken";
import User from "../models/UserModel";
import connectDB from "../config/db";

export async function sellerAuth(req) {
  try {
    console.log("run")
  
    // گرفتن توکن از هدر
    const authHeader = req.headers.get('Authorization');
  
    if (!authHeader) throw new Error("Authorization token required");

    const token = authHeader.split(" ")[1];

    const { _id } = jwt.verify(token, process.env.SECRET);

    // اتصال به دیتابیس
    await connectDB();
    const user = await User.findById(_id).select("_id role");

    if (!user || user.role !== "seller") {
      throw new Error("Not authorized");
    }

    return user; // اگر ادمین بود، اطلاعات کاربر برگردون
  } catch (error) {
    throw new Error("Not authorized");
  }
}
