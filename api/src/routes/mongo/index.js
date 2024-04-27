import express from "express"
const router = express.Router()

import book from "./book"
router.use(book)

export default router