import { DataTypes } from "sequelize"
import sequelize from "../configs/db"

const Book = sequelize.define("books", {
	title: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	author_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
})

export default Book
