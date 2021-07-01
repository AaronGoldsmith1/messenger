const router = require("express").Router();
const messagesController = require('../../controllers/messagesController');

router.post("/", messagesController.createMessage);
router.patch("/updateReadStatus", messagesController.updateMessageReadStatus);

module.exports = router;
