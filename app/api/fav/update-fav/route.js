import dbConnect from "@/config/db"
import { requireAuth } from "@/lib/auth"
import { NextResponse } from "next/server"
import Fav from "@/models/FavModel"


export async function POST(request) {
    try {
        const {productId} = await request.json()
        const {_id} = await requireAuth(request)
    
        if(!_id) {
            return NextResponse.json({success: false, message: "You must be loged in to do this action"})
        }

        await dbConnect()

        const list = await Fav.findOne({userId: _id})

        if(!list) {
            const fav = await Fav.create({userId: _id, products: [productId]})
        }else{
            const exist = list.products.includes(productId)

            if(exist) {
                const remove = await Fav.updateOne({_id: list._id}, {$pull: {products: productId}})
            }else{
                const add = await Fav.updateOne({_id: list._id}, {$push: {products: productId}})
            }
        }

        return NextResponse.json({success: true, message: "added to favs"})

    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}