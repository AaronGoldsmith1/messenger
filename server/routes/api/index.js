const router = require("express").Router();
const messagesRouter = require("./messages");
const conversationsRouter = require("./conversations");
const usersRouter = require("./users");

router.use("/messages", messagesRouter);
router.use("/conversations", conversationsRouter);
router.use("/users", usersRouter);

router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

module.exports = router;
