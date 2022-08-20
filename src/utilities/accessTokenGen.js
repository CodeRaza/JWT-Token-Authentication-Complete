const jwt = require("jsonwebtoken");

const accessTokenGenerator = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "20s"});
}

module.exports = accessTokenGenerator;