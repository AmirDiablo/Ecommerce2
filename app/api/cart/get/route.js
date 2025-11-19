import dbConnect from "@/config/db";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import User from "@/models/UserModel";

export async function GET(request) {
    try {
        const {_id} = await requireAuth(request)

        await dbConnect()
        const user = await User.findById(_id)

        const {cartItems} = user

        return NextResponse.json({success: true, cartItems})
    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}