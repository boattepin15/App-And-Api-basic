import express from "express"
const router = express.Router()

import book from "./book"
import auth from "./auth"
import user from "./user"

router.use("/auth", auth)
router.use(book)
router.use(user)

export default router