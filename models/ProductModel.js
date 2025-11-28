import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId: {type: String, required: true, ref: "User"},
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    offerPrice: {type: Number, required: true},
    image: {type: [String], required: true},
    category: {type: String, required: true},
    date: {type: Number, required: true},
    rate: {type: Number, default: 0},
    rateCount: {type: Number, default: 0}
})

productSchema.index({name: "text", description: "text", category: "text"})

const Product = mongoose.models.Product || mongoose.model("Product", productSchema)

export default Product