// app/api/user/googleSign/route.js
import { NextResponse } from "next/server";
import User from "../../../../models/UserModel";
import connectDB from "../../../../config/db";
import jwt from "jsonwebtoken";

// ساخت توکن
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

export async function POST(req) {
  try {
    await connectDB(); // اتصال به دیتابیس

    const { googleId, username, email } = await req.json();

    // بررسی وجود کاربر
    let user = await User.findOne({ email });

    if (!user) {
      const account = await User.create({ username, email, googleId });
      user = account;
    }

    const token = createToken(user._id);

    return NextResponse.json({ id: user._id, token }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
