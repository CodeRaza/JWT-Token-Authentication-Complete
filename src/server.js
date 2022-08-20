require("dotenv").config();

const express = require("express");
const endpoints = require('express-list-endpoints');

const app = express();
const port = process.env.PORT;
const db = require("./config/database")

const loginRouter = require("./api/routes/login");
const registerRouter = require("./api/routes/register");

app.use(express.json());

// Handling all Routes
app.use("/api/auth/", loginRouter);
app.use("/api/account/register", registerRouter);

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