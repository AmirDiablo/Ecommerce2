import mongoose from "mongoose";
import User from "./UserModel";

const commentSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    text: {type: String, required: true},
    productId: {type: String, required: true},
    replyTo: {type: String, default: null},
    like: {type: [String]},
    dislike: {type: [String]},
    date: {type: Number, required: true}
})

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema)

export default Comment