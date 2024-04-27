import express from "express"
const router = express.Router()
import authMiddleware from "../middlewares/auth"
import Book from "../model/Book"

router.use(authMiddleware)

router.get("/me", async (req, res) => {
	res.send(req.user)
})

router.get("/user/books", async (req, res) => {
	const books = await Book.findAll({
		where: {
			author_id: req.user.id,
		},
	})

    res.send(books)
})

export default router
