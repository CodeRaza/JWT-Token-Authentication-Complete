const router = require("express").Router()
const jwt = require("jsonwebtoken");

const UserModel = require("../models/User")
const RefreshToken = require("../models/RefreshToken");

const authenticateToken = require('../middleware/authenticateToken');
const accessTokenGenerator = require("../../utilities/accessTokenGen");


router.get("/users", authenticateToken, async (req, res)=>{
    const users = await UserModel.findAll()
    res.json(users)
})

router.post("/token", async (req, res)=>{
    const refreshToken = req.body.token;
    if(refreshToken == null) return res.json({error_message: "Please Send Refresh Token"})

    const token = RefreshToken.findOne({where: {token: refreshToken}})

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
        console.log(access_token);
        res.json({access_token: access_token});
    })
})

router.post("/login", async (req, res) => {
    
    const {username, password} = req.body;
    
    const user = await UserModel.findOne({
        where: {
            username: username,
            password: password
        }
    })

    if(!user){
        return res.json({
            error_message: "Wrong Credientials"
        })
    }

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

})

router.delete("/logout", async (req, res) => {

    await RefreshToken.destroy({where: {token: req.body.token}});

    res.json({
        "message": "User Logout!"
    })
})

module.exports = router;