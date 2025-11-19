import dbConnect from "@/config/db";
import User from "@/models/UserModel";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const {_id} = await requireAuth(request)

        const {cartData} = await request.json()

        await dbConnect()

        const user = await User.findById(_id)

        user.cartItems = cartData
        await user.save()

        return NextResponse.json({success: true})

    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}