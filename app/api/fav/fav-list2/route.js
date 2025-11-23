import dbConnect from "@/config/db";
import { requireAuth } from "@/lib/auth";
import Fav from "@/models/FavModel";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const {_id} = await requireAuth(request)
        
        if(!_id) {
            return NextResponse.json({success: false, message: "You must be loged in to do this action"})
        }

        await dbConnect()

        const fav = await Fav.findOne({ userId: _id })
        .populate({ path: 'products', model: 'Product' });

        const list = fav.products

        return NextResponse.json({success: true, list})

    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}