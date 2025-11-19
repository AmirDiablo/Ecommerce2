import dbConnect from "@/config/db"
import Address from "@/models/Address"
import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"


export async function GET(request) {
    try {
        const {_id} = await requireAuth(request)
    
        await dbConnect()

        const addresses = await Address.find({userId: _id})

        return NextResponse.json({success: true, addresses})
        
    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}