import express from "express"
import bcrypt from "bcryptjs"
import User from "../model/User"
const router = express.Router()
import { createToken } from "../utils/token"
import authMiddleware from "../middlewares/auth"
import resetPassword from "../utils/resetPassword"

router.post("/register", async (req, res) => {
	const { body } = req
	try {
		const user = await User.create({
			username: body.username,
			password: bcrypt.hashSync(body.password),
			tokenVersion: 1,
		})

		const userJson = user.toJSON()

		delete userJson.password

		res.send({ user: userJson })
	} catch (error) {
		console.log(error)
		res.status(500).send({ error })
	}
})

router.post("/login", async (req, res) => {
	const { body } = req

	const user = await User.findOne({
		where: {
			username: body.username,
		},
	})

	if (!user) {
		return res.sendStatus(401)
	}

	if (!bcrypt.compareSync(body.password, user.password)) {
		return res.sendStatus(401)
	}

	const userJson = user.toJSON()

	delete userJson.password

	const token = createToken({ sub: user.id, v: user.tokenVersion })

	res.send({
		user: userJson,
		token,
	})
})

router.delete("/logout", authMiddleware, async (req, res) => {
	const user = await User.findByPk(req.user.id)
	user.tokenVersion += 1
	await user.save()
	res.send({ status: "sucess" })
})

router.get("/reset_password", async (req, res) => {
	if (!req.query.email) {
		return res.sendStatus(400)
	}

	const user = await User.findOne({
		where: {
			username: req.query.email,
		},
	})

	if (!user) {
		return res.sendStatus(400)
	}

	const code = await resetPassword({ email: req.query.email })

	user.resetPasswordCode = code
	user.resetCodeExpiredIn = Date.now() + (1000 * 60)

	await user.save()

	res.send({ status: "success" })
})

router.post("/reset_password", async (req, res) => {
	const { query } = req

	if (!query.email && !query.code && !query.newPassword) {
		return res.sendStatus(400)
	}

	const user = await User.findOne({
		where: {
			username: req.query.email,
		},
	})

	if (!user) {
		return res.sendStatus(400)
	}

	if (user.resetPasswordCode != query.code || user.resetCodeExpiredIn < Date.now()) {
		return res.sendStatus(400)
	}

	user.password = bcrypt.hashSync(query.newPassword)
	user.resetPasswordCode = null

	await user.save()

	res.send({
		status: "success",
	})
})

export default router
