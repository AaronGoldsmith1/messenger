const router = require("express").Router();
const conversationsController = require('../../controllers/conversationsController');

router.get("/", conversationsController.getConversations);

module.exports = router;
