const router = require("express").Router();
const emailVerificationController = require("../controllers/emailVerificationController");

router.post("/send_email_verification_link/", emailVerificationController.send_email_for_verification);
router.post("/email-verify/:email/:token", emailVerificationController.email_verify);

module.exports = router;