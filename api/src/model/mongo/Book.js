import { model, Schema } from "mongoose";

const Book = model("books", new Schema({
    title: {
        type: String,
        required: true
    },
    author_id: {
        type: Number,
        required: true
    }
}))

export default Book