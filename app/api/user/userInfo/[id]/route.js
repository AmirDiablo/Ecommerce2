import { NextResponse } from "next/server";
import connectDB from "../../../../../config/db"
import User from "../../../../../models/UserModel"

export async function GET(req, { params }) {
    try {
        await connectDB(); // اتصال به دیتابیس

        const { id } = await params; // گرفتن آیدی از URL

        const user = await User.findById(id).select("-password"); // حذف فیلد حساس مثل پسورد

        if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}