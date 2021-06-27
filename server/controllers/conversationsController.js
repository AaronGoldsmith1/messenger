const { Conversation } = require("../db/models");
const { formatAllConversations } = require('../lib/conversations/conversationFormatter');

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
// TODO: for scalability, implement lazy loading
async function getConversations (req, res, next) {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    
    const conversations = await Conversation.findAllConversationsAndMessages(userId);

    const formattedConversations = formatAllConversations(conversations);

    res.json(formattedConversations);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getConversations,
}