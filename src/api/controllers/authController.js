const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/User");
const RefreshToken = require("../models/RefreshToken");

const accessTokenGenerator = require("../../utilities/accessTokenGen");

exports.login = async (req, res) => {
    
    const {username, password} = req.body;

    const user = await UserModel.findOne({
        where: {
            username: username
        }
    })

    if(user){
        const validPassword = await bcrypt.compare(password, user.password);
        if(validPassword){
            const accessToken = accessTokenGenerator(user.toJSON())
            const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_TOKEN_SECRET);
            
            const dbRefreshToken = await RefreshToken.create({
                token: refreshToken
            })

            await dbRefreshToken.save()

            res.json({
                "user": user,
                "access_token": accessToken,
                "refresh_token": refreshToken
            })
        } else {
            return res.json({"error_message": "Wrong Credientials"})
        }
    } else {
        return res.json({"error_message": "Wrong Credientials"})
    }
};

exports.logout = async (req, res) => {

    if(req.body.token == undefined || req.body.token == null) return res.json({"error_message": "Token Not Found!"})

    const token = req.body.token;

    const tokenCheck = await RefreshToken.findOne({where: {token: token}})

    if(!tokenCheck){
        return res.json({
            error_message: "Token Not Exists"
        })
    }

    await RefreshToken.destroy({where: {token: token}, force: true});

    res.json({
        "message": "User Logout!"
    })
}


exports.accessToken= async (req, res)=>{
    const refreshToken = req.body.token;
    if(refreshToken == null) return res.json({error_message: "Please Send Refresh Token"})

    const token = await RefreshToken.findOne({where: {token: refreshToken}})

    if(!token){
        return res.json({
            error_message: "Token Not Exists"
        })
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.json({"error_message": "Invalid Token"});
        const access_token = accessTokenGenerator({
            username: user.username,
            email: user.email,
            password: user.password
        });
        res.json({access_token: access_token});
    })
}