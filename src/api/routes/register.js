const router = require("express").Router();
const registerController = require("../controllers/registerController");

router.post("/", registerController.register);
router.post("/email-verify/:username/:token", registerController.email_verify);

module.exports = router;