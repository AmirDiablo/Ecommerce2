import mongoose from "mongoose";

const rateSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    productId: {type: String, required: true},
    rating: {type: Number, required: true}
})

const Rate = mongoose.models.Rate || mongoose.model("Rate", rateSchema)

export default Rate