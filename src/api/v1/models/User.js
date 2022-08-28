const sequelize = require("../../../config/database")
const { DataTypes } = require("sequelize");

const User = sequelize.define("User", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true,
        },
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});


module.exports = User;
    
