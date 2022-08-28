const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/User");
const RefreshToken = require("../models/RefreshToken");

const accessTokenGenerator = require("../../utilities/accessTokenGen");

exports.register = async (req, res) => {

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
    
    const hashed = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
        username: username,
        email: email, 
        password: hashed,
        isActive: false
    })

    await user.save();

    const accessToken = accessTokenGenerator(user.toJSON())
    const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_TOKEN_SECRET);

    const dbRefreshToken = await RefreshToken.create({
        token: refreshToken
    })

    await dbRefreshToken.save()

    const email_verify_token = accessTokenGenerator(user.toJSON);

    const message = `${process.env.BASE_URL}/account/email-verify/${username}/${email_verify_token}`;
    await sendEmail(user.email, "Verify Email", message);

    res.json({
        "status": 200,
        "user": user,
        "Message": "An mail sent to your account please verify to Activate your Account.",
        "access_token": accessToken,
        "refresh_token": refreshToken
    })
}


exports.email_verify = async (req, res) => {
    const token = req.params.token;
    const username = req.params.username;

    const user = await UserModel.findOne({where: {username: username}});

    if (user) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) return res.json({"error_message": "Invalid Token"});
            const updated = UserModel.update({isActive: true}, {where: {username: username}})   
            res.json({"message": "User Verified!"})
        })
    } else {
        res.json({
            "error_message": "Wrong Token or User"
        })
    }

}