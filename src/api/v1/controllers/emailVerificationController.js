const jwt = require("jsonwebtoken");

const UserModel = require("../models/User");

const accessTokenGenerator = require("../../../utilities/accessTokenGen");
const sendEmail = require("../../../utilities/emailSender")

exports.send_email_for_verification = async (req, res) => {
    const email = req.body.email;

    const user = await UserModel.findOne({
        where: {
            email: email
        }
    })

    if(!user) return res.json({"message": "if user exist! Email will sent for verification"});

    const email_verify_token = accessTokenGenerator(user.toJSON());

    const message = `${process.env.BASE_URL}/account/email-verify/${email}/${email_verify_token}`;
    await sendEmail(email, "Verify Email", message);

    res.json({"message": "if user exist! Email will sent for verification"});
}

exports.email_verify = async (req, res) => {
    const token = req.params.token;
    const email = req.params.email;

    const user = await UserModel.findOne({where: {email: email}});

    if (user) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) return res.json({"error_message": "Invalid Token, Try Again"});
            const updated = UserModel.update({isActive: true}, {where: {email: email}})   
            res.json({"message": "User Verified!"})
        })
    } else {
        res.json({
            "error_message": "Wrong Token or User"
        })
    }
}