const sequelize = require("../../config/database")
const { DataTypes } = require("sequelize");

const RefreshToken= sequelize.define("RefreshToken", {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = RefreshToken;
    
