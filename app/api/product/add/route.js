import { v2 as cloudinary } from "cloudinary";
import { sellerAuth } from "@/lib/authSeller";
import { NextResponse } from "next/server";
import dbConnect from "../../../../config/db";
import Product from "../../../../models/ProductModel";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


export async function POST(request) {
    try {
        const user = await sellerAuth(request);

        if(!user) {
            return NextResponse.json({success: false, message: "not authorized"})
        }

        const formData = await request.formData()

        const name = formData.get("name")
        const description = formData.get("description")
        const category = formData.get("category")
        const price = formData.get("price")
        const offerPrice = formData.get("offerPrice")

        const files = formData.getAll("images")

        if(!files || files.length === 0) {
            return NextResponse.json({success: false, message: "no files uploaded"})
        }

        const result = await Promise.all(
            files.map(async(file)=> {
                const arrayBuffer = await file.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)

                return new Promise((resolve, reject)=> {
                    const stream = cloudinary.uploader.upload_stream(
                        {resource_type: 'auto'},
                        (error, result) => {
                            if(error) {
                                reject(error)
                            }else{
                                resolve(result)
                            }
                        }
                    )
                    stream.end(buffer)
                })
            })
        )

        const image = result.map(r => r.secure_url)

        await dbConnect()
        
        const newProduct = await Product.create({
            userId: user._id.toString(),
            name,
            description,
            category,
            price:Number(price),
            offerPrice:Number(offerPrice),
            image,
            date:Number(Date.now())
        })

        return NextResponse.json({success: true, message: "upload successful", newProduct})
        
    } catch (error) {
        return NextResponse.json({success: false, message: error.message}, {status: 500})
    }
}