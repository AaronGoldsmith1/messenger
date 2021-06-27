const router = require("express").Router();
const authController = require('../../controllers/authController')

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.delete("/logout", authController.logoutUser);
router.get("/user", authController.getUser);

module.exports = router;
