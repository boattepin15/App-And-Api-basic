import express from "express"
import cors from "cors"
import sequelize from "./src/configs/db"
import mongo from "./src/configs/mongo"
import mongoRoutes from "./src/routes/mongo"
import router from "./src/routes"
const app = express()

app.use(cors("*"))
app.use(express.json())

const PORT = 5050

app.use('/mongo', mongoRoutes)
app.use(router)

app.get("/test", (req, res) => {
	res.send("Hello World!")
})

const startServer = async () => {
	await Promise.all([sequelize.sync({ force: false }), mongo()])
	app.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`)
	})
}

startServer()
