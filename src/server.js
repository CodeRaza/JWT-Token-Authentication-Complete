require("dotenv").config();

const express = require("express");
const endpoints = require('express-list-endpoints');

const app = express();
const port = process.env.PORT;
const db = require("./config/database")

const userRouterV1 = require("./api/v1/routes/user");
const loginRouterV1 = require("./api/v1/routes/login");
const registerRouterV1 = require("./api/v1/routes/register");
const passwordResetRouterV1 = require("./api/v1/routes/password_reset");
const emailVerificationV1 = require("./api/v1/routes/email_verification");

app.use(express.json());

// Handling all Routes For Version 1 API
app.use("/api/v1/users", userRouterV1);
app.use("/api/v1/auth/", loginRouterV1);
app.use("/api/v1/account/register", registerRouterV1);
app.use("/api/v1/email-verification", emailVerificationV1);
app.use("/api/v1/password-reset", passwordResetRouterV1);

// 404 Request Handle
app.use((req, res) => {
    res.json({
        status: 404,
        msg: "Welcome, It's the completed JWT Authentication API",
        routes: endpoints(app)
    })
})

// Database Connection
db.sync()
    .then(()=>{
        console.log('Connection has been established successfully.');
    })
    .catch((err)=>{
        console.error('Unable to connect to the database:', err);
    })

// Listening Server
app.listen(port, () => {
    console.log(`SERVER IS LISTENING ON PORT ${port}`);
    console.log(`Go to http://localhost:${port}`);
})