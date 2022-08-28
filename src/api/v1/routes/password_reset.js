const router = require("express").Router();
const passwordResetController = require("../controllers/passwordResetController");

router.post("/reset", passwordResetController.password_reset);
router.post("/forget-password-send-email", passwordResetController.forget_password_send_email);
router.post("/forget-password/:email/:token", passwordResetController.forget_password);

module.exports = router;