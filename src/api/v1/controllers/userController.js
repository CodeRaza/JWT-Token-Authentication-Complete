const UserModel = require("../models/User");

exports.allUsers = async (req, res)=>{
    const users = await UserModel.findAll()
    res.json(users)
}