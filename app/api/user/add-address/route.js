import dbConnect from "@/config/db"
import Address from "@/models/Address"
import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"


export async function POST(request) {
    try {
        const {_id} = await requireAuth(request)
        const {address} = await request.json()

        await dbConnect()

        const newAddress = await Address.create({...address, userId: _id})

        return NextResponse.json({success: true, message: "Address added"})
        
    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}