import { Sequelize } from "sequelize"
const sequelize = new Sequelize({
	host: "localhost",
	username: "root",
	password: "root",
	database: "book_management",
	dialect: "mysql",
	logging: false,
})

export default sequelize
