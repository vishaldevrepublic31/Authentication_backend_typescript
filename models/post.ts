import mongoose, { Document, Model, Schema } from "mongoose";

interface IPost extends Document {
    title: string
    description: string
    avatar: string
    creator: mongoose.Types.ObjectId[]
}

const postSchema: Schema<IPost> = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required !"],
    },
    description: {
        type: String,
        required: [true, "description is required !"],
    },
    avatar: {
        type: String,
    },
    creator: [{
        type: mongoose.Types.ObjectId,
        required: [true, "Please login first"],
        ref: "User",
    }],
},
    { timestamps: true }
)

const Post: Model<IPost> = mongoose.model<IPost>("Post", postSchema)

export { Post }