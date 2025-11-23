import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    text: {type: String, required: true},
    productId: {type: String, required: true},
    replyTo: {type: String, default: null}
})

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema)

export default Comment