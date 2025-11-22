import mongoose from "mongoose";

const favSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    products: [{ type: mongoose.Types.ObjectId, ref: "" }]
})

const Fav = mongoose.models.Fav || mongoose.model("Fav", favSchema)

export default Fav