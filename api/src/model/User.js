import { DataTypes } from "sequelize"
import sequelize from "../configs/db"

const User = sequelize.define("users", {
	username: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	tokenVersion: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	resetPasswordCode: {
		type: DataTypes.INTEGER,
	},
	resetCodeExpiredIn: {
		type: DataTypes.BIGINT,
	},
})

export default User
