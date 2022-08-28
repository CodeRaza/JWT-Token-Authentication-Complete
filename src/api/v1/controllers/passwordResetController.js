const UserModel = require("../models/User");
const bcrypt = require("bcrypt");

const accessTokenGenerator = require("../../../utilities/accessTokenGen");
const sendEmail = require("../../../utilities/emailSender");

exports.password_reset = async (req, res) => {
    const {username, password, new_password} = req.body;

    const user = await UserModel.findOne({
        where: {
            username: username
        }
    })

    if(user){
        const validPassword = await bcrypt.compare(password, user.password);
        if(validPassword){
            
            const new_encrypted_password = await bcrypt.hash(new_password, 10);

            await UserModel.update({password: new_encrypted_password}, {where: {username: username}});

            res.json({
                "message": "Password Reset Successfully"
            })

        } else {
            return res.json({"error_message": "Wrong Credientials"})
        }
    } else {
        return res.json({"error_message": "Wrong Credientials"})
    }
}

exports.forget_password_send_email = async (req, res) => {
    const email = req.body.email;
    if(!email) return res.json({error_message: "Send Email Address"});

    const user = await UserModel.findOne({
        where: {
            email: email
        }
    })

    if(!user) return res.json({"message": "if user exist! Email will sent for Password Reset"});

    const email_verify_token = accessTokenGenerator(user.toJSON());

    const message = `${process.env.BASE_URL}/password-reset/forgot-password/${email}/${email_verify_token}`;
    await sendEmail(email, "Verify Email", message);

    res.json({"message": "if user exist! Email will sent for Password Reset"});
}


exports.forget_password = async (req, res) => {
    const token = req.params.token;
    const email = req.params.email;

    const new_password = req.body.password;

    const user = await UserModel.findOne({where: {email: email}});

    if(user) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
            if(err) return res.json({"error_message": "Invalid Token, Try Again"});
                
            const new_encrypted_password = await bcrypt.hash(new_password, 10);
    
            await UserModel.update({password: new_encrypted_password}, {where: {email: email}});
    
            res.json({
                "message": "Password Reset Successfully"
            })
        })
    } else {
        res.json({
            "error_message": "Wrong Token or User"
        })
    }
}