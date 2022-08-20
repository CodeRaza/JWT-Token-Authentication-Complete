const router = require("express").Router();
const accessTokenGenerator = require("../../utilities/accessTokenGen");
const UserModel = require("../models/User");
const RefreshToken = require("../models/RefreshToken");


router.post("/", async (req, res) => {

    const {username, email, password} = req.body;

    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if(!email.match(mailformat)){
        return res.json({
            "error_message": "Use a valid email address"
        })
    }

    if(await UserModel.findOne({where: {username: username}})){
        return res.json({
            "error_message": "username already exists"
        })
    }

    if(await UserModel.findOne({where: {email: email}})){
        return res.json({
            "error_message": "email already exists"
        })
    }

    const user = await UserModel.create({
        username: username,
        email: email, 
        password: password,
        isActive: false
    })

    await user.save();

    const accessToken = accessTokenGenerator(user.toJSON())
    const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_TOKEN_SECRET);

    const dbRefreshToken = await RefreshToken.create({
        token: refreshToken
    })

    await dbRefreshToken.save()

    res.json({
        "status": 200,
        "user": user,
        "access_token": accessToken,
        "refresh_token": refreshToken
    })
})

module.exports = router;