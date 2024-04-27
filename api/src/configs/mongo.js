import mongoose from "mongoose"

export default () => {
	return mongoose.connect("mongodb://localhost:27018/books")
}
