import User from "../model/User"
import { verifyToken } from "../utils/token"

const authMiddleware = async (req, res, next) => {
	if (!req.headers.authorization) {
		return res.sendStatus(401)
	}
	const [bearer, token] = req.headers.authorization.split(" ")
	try {
		const decoded = verifyToken(token)
		const user = await User.findByPk(decoded.sub)
		if (decoded.v !== user.tokenVersion) {
			return res.sendStatus(401)
		}
		req.user = user.toJSON()
		next()
	} catch (error) {
		res.status(500).send({ error })
	}
}

export default authMiddleware