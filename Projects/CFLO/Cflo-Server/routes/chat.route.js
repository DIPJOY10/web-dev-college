const { 
    findOrCreateBotConversation, 
    findUserChat,
    findProfileChat,
    message,
    initConv,
    lastSeenHelper,
    conversationDetail,
    getMoreMessages,
    findMutualConversation,
    updateConversation,
    addParticipantsWithConversation,
    getConversationById
} = require('../controllers/chat.controller')

module.exports = app => {
    app.post('/api/chat/findOrCreateBotConversation',findOrCreateBotConversation);
    app.post('/api/chat/findUserChat',findUserChat);
    app.post('/api/chat/findProfileChat',findProfileChat);
    app.post('/api/chat/add/participants/conv',addParticipantsWithConversation);
    app.post('/api/chat/get/byconvid/conv',getConversationById);

    app.post('/api/chat/mutual',findMutualConversation);
    app.post('/api/chat/message',message);
    app.post('/api/chat/lastSeen',lastSeenHelper);
    app.post('/api/chat/initConv',initConv);
    app.post('/api/chat/conversationDetail',conversationDetail);
    app.post('/api/chat/getMoreMessages',getMoreMessages);
    app.post('/api/chat/conversation/update',updateConversation);

}