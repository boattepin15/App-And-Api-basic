const nodemailer = require("nodemailer")
import dotenv from "dotenv"
dotenv.config()

const restCode = () => {
	const rnd = Math.random().toString().substring(5, 9)
	return parseInt(rnd)
}

async function resetPassword({ email }) {
	let transporter = nodemailer.createTransport({
		service: "gmail",
		host: "smtp.gmail.com",
		port: 587,
		secure: false,
		auth: {
			user: process.env.SEND_MAIL_USER,
			pass: process.env.SEND_MAIL_PASS,
		},
	})

	const code = restCode()

	await transporter.sendMail({
		from: '"Sendmail Test" <test@mail.com>', // sender address
		to: email, // list of receivers
		subject: "Reset Password from SendMail Test", // Subject line
		text: `your reset password code is: ${code} or link: http://google.com`, // plain text body
		html: `<b>your reset password code is: ${code} <a href='http://google.com'>Link</a></b>`, // html body
	})

	return code
}

export default resetPassword
