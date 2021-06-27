const authRouter = require("express").Router();
const usersRouter = require("express").Router();
const messagesRouter = require("express").Router();

const authController = require('./controllers/authController');
const usersController = require('./controllers/users');


authRouter.get("/user", authController.getUser);
authRouter.post("/register", authController.registerUser);
authRouter.post("/login", authController.loginUser);
authRouter.delete("/logout", authController.logoutUser);

usersRouter.get("/:username", usersController.getUsers)





moduel.exports = {
  authRouter
}