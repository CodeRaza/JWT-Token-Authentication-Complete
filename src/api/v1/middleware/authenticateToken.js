const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.json({"error_message": "No Token Found!"})

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.json({"error_message": "Invalid Token"});
        req.user = user;
        next();
    })
}

module.exports = authenticateToken;
