const router = require("express").Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/", authenticateToken, userController.allUsers);

module.exports = router;