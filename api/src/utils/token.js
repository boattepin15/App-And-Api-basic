import jwt from "jsonwebtoken"

const JWT_SECRET = "hfjkahfjkasdhfjkdsfdsakljdla"

export const createToken = (sub) => {
	const token = jwt.sign(sub, JWT_SECRET, {expiresIn: "7d"})

    return token
}



export const verifyToken = (token) => {
    const decoded = jwt.verify(token, JWT_SECRET)

    return decoded
}