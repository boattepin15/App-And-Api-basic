import express from "express"
import Book from "../../model/mongo/Book"
const router = express.Router()

router.post("/create_book", async (req, res) => {
	const { body } = req

	const book = await Book.create({
		title: body.title,
		author_id: body.author_id,
	})

	res.send({
		status: "success",
		book: book,
	})
})

router.get("/books", async (req, res) => {
	if (req.query.id) {
		const book = await Book.find({
			_id: req.query.id,
		})
		res.send(book)
	} else {
		const books = await Book.find()
		res.send(books)
	}
})

router.get("/books/:id", async (req, res) => {
	const book = await Book.findById(req.params.id)
	res.send(book)
})

router.patch("/update_book/:id", async (req, res) => {
	const { body, params } = req
	const result = await Book.updateOne(
		{ _id: params.id },
		{
			$set: { title: body.title },
		}
	)

	if (!result.matchedCount) {
		return res.send({
			status: "error",
			message: "book cannot found",
		})
	}

	res.send({
		status: "success",
		title: body.title,
	})
})

router.delete("/delete_book/:id", async (req, res) => {
	const { params } = req
	const result = await Book.deleteOne({ _id: params.id })
	if (!result.deletedCount) {
		return res.send({
			status: "error",
			message: "book cannot found",
		})
	}

	res.send({
		status: "success",
	})
})

export default router
