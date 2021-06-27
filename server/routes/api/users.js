const router = require("express").Router();
const usersController = require('../../controllers/usersController')

router.get("/:username", usersController.getUsers);

module.exports = router;
