const router = require("express").Router();
const loginController = require("../controllers/authController");

router.post("/login", loginController.login);
router.post("/logout", loginController.logout)
router.post("/new_access_token", loginController.accessToken)

module.exports = router;