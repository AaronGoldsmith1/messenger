const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");
const { formatConversation } = require('../../lib/conversations/conversationFormatter');

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );
    
    if (conversation && !conversationId) {
      return res.sendStatus(400);
    }

    //ensure conversation exists between sender and recipient and matches request
    if (conversation && conversationId === conversation.id) {
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    } else if (conversation && conversationId != conversation.id) {
      return res.sendStatus(403);
    }

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

router.patch("/updateReadStatus", async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { otherUser, messages, id: conversationId } = req.body;

    const conversation = await Conversation.findConversation(
      senderId,
      otherUser.id
    );

    // Verify conversation exists and matches the request
    if (conversation && conversationId === conversation.id) {
        await Message.update({
          unread: false,
        }, {
          where: {
            conversationId: {
              [Op.eq]: conversation.id
            },
            senderId: {
              [Op.not]: senderId
            },
            unread: {
              [Op.is]: true
            }
          }
        });
    } else if (conversation && conversationId != conversation.id) {
      return res.sendStatus(403);
    }

    const updatedConversation = await Conversation.findOneConversationAndMessages(
      senderId, 
      otherUser.id
    );
    
    const formattedConversation = formatConversation(updatedConversation);

    res.json(formattedConversation);
  } catch (error) {
    next(error);
  }
})

module.exports = router;
