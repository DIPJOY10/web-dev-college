const User = require('../models/user.model');
const Chat = require('../models/chatAndMessages.model');
const async = require('async');
var mongoose = require('mongoose');
const keys = require('../keys/keys');
const socketApi = require('../services/socket')
const _ = require('lodash');
const AccessRole = require('../models/access.role.model');
const ObjectId = require('mongoose').Types.ObjectId;

const { Message, Conversation } = Chat;


const lastSeenHelper = async (req, res) => {
    try {
        const conversationId = req.body.conversationId;
        const userId = req.body.userId;
        const now = new Date();

        let conversation = await Conversation.findById(conversationId)
            .populate('topMessage')
            .populate({
                path: 'groupDP',
                model: 'File',
                select: 'url thumbUrl'
            })
        const message = conversation.topMessage

        var lastSeenPath = 'lastSeen.' + userId;
        conversation.set(lastSeenPath, now)
        var participants = conversation.participants;
        await conversation.save()
        conversation = await Conversation.findById(conversationId)
            .populate('topMessage')
            .populate({
                path: 'participants', select: 'parent parentModelName', populate: {
                    path: 'parent', select: 'name displayName wallet', populate: {
                        path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                    }
                }
            })
            .populate({
                path: "participantsRole",
                model: 'AccessRole',
                populate: {
                    path: "user",
                    select: 'parent parentModelName',
                    populate: {
                        path: 'parent',
                        select: 'name displayName wallet',
                        populate: {
                            path: 'displayPicture',
                            model: 'File',
                            select: 'url thumbUrl'
                        }
                    }
                }
            })
            .populate({
                path: 'groupDP',
                model: 'File',
                select: 'url thumbUrl'
            })

        const data = {
            messages: [message],
            conversation
        }

        res.status(200).json({
            data
        })

        socketApi(req, participants, {
            type: 'onMessage',
            payload: data
        })

    } catch (error) {
        res.status(400).json({
            data: null,
            error: 'This is an error!'
        });
    }

}

const createChatBotConversation = async (req, res) => {
    var chatBotId = keys.chatBotId;
    var userId = req.body.userId;
    const convMessage = await initConvHelper({
        participants: [userId, chatBotId],
        user: chatBotId,
        type: 'CustomerCareBot',
        text: "Hello, from ContractFlo's platform support bot."
    })

    res.status(200).json({
        data: convMessage
    })
}

const findOrCreateBotConversation = async (req, res) => {
    try {
        let botConvs = await Conversation.find({
            participants: { "$in": [req.body.userId] },
            type: "CustomerCareBot"
        })
            .populate('topMessage')
            .populate({
                path: 'participants', select: 'parent parentModelName', populate: {
                    path: 'parent', select: 'name displayName wallet', populate: {
                        path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                    }
                }
            })
            .populate({
                path: "participantsRole",
                model: 'AccessRole',
                populate: {
                    path: "user",
                    select: 'parent parentModelName',
                    populate: {
                        path: 'parent',
                        select: 'name displayName wallet',
                        populate: {
                            path: 'displayPicture',
                            model: 'File',
                            select: 'url thumbUrl'
                        }
                    }
                }
            })
            .populate({
                path: 'groupDP',
                model: 'File',
                select: 'url thumbUrl'
            })

        if (botConvs.length > 0) {
            res.status(200).json({
                data: botConvs[0]
            });
        } else {
            createChatBotConversation(req, res)
        }
    } catch (error) {
        res.status(400).json({
            error
        })
    }
}

const initConvHelper = async (convBody) => {
    try {
        let msgWithRoleIdsArr = []
        let accessRoleArr = []

        let conversation = new Conversation({
            creator: convBody.user,
            participants: convBody.participants,
            type: convBody.type
        });

        convBody.participantsRole.length > 0 && convBody.participantsRole.map((userRole) => {
            const accessRoleObj = new AccessRole({
                user: userRole.user._id,
                role: userRole.role,
                parent: conversation._id,
                parentModelName: "Conversation",
                creator: conversation.user,
            })
            msgWithRoleIdsArr.push(accessRoleObj._id)
            accessRoleArr.push(accessRoleObj)
        })


        if (convBody.groupName) {
            conversation.groupName = convBody.groupName
        }

        if (convBody.groupDP) {
            conversation.groupDP = convBody.groupDP
        }

        if (msgWithRoleIdsArr.length > 0) {
            conversation.participantsRole = msgWithRoleIdsArr
        }


        let message = new Chat.Message({
            text: convBody.text,
            user: convBody.user,
            conversation: conversation._id
        });

        conversation.topMessage = message._id;

        var userId = message.user;
        var timeStamp = message.createdAt;
        var lastSeenPath = 'lastSeen.' + userId;
        conversation.set(lastSeenPath, timeStamp)

        await message.save()
        const accessRoleRes = await AccessRole.insertMany(accessRoleArr);
        await conversation.save()
        conversation = await Conversation.findById(conversation._id)
            .populate('topMessage')
            .populate({
                path: 'participants', select: 'parent parentModelName', populate: {
                    path: 'parent', select: 'name displayName wallet', populate: {
                        path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                    }
                }
            })
            .populate({
                path: "participantsRole",
                model: 'AccessRole',
                populate: {
                    path: "user",
                    select: 'parent parentModelName',
                    populate: {
                        path: 'parent',
                        select: 'name displayName wallet',
                        populate: {
                            path: 'displayPicture',
                            model: 'File',
                            select: 'url thumbUrl'
                        }
                    }
                }
            })
            .populate({
                path: 'groupDP',
                model: 'File',
                select: 'url thumbUrl'
            })
            .sort('-updatedAt')

            
        return {
            message: [message],
            conversation: conversation,
            accessRoleRes: accessRoleRes
        }

    } catch (error) {
        return null
    }
}

const initConv = async (req, res) => {
    const convBody = req.body
    let oldCovs = []

    if (convBody.type !== 'Group') {
        const participants = convBody.participants || []
        oldCovs = await Conversation.find({
            $and: [
                {
                    participants: { $in: [participants[0]] }
                },
                {
                    participants: { $in: [participants[1]] }
                },
                { type: { $ne: 'Group' } },
                { topMessage: { $exists: true } }
            ]
        })
            .populate('topMessage')
            .populate({
                path: 'groupDP',
                model: 'File',
                select: 'url thumbUrl'
            })

        if (oldCovs.length > 0) {
            var conv = oldCovs[0]
            req.body.conversation = conv._id;
            message(req, res)
        } else {

            const data = await initConvHelper(convBody)
            res.status(200).json({
                data
            })

        }
    } else {

        console.log(convBody)

        const data = await initConvHelper(convBody)

        res.status(200).json({
            data
        })

    }

}

const message = async (req, res) => {

    try {

        let message = new Message(req.body);

        await message.save()

        const convId = message.conversation;

        message = await Message.findById(message._id).populate('files')
        let conversation = await Conversation.findByIdAndUpdate(
            convId,
            { _id: convId, topMessage: message._id }
        )
            .populate({
                path: 'participants', select: 'parent parentModelName', populate: {
                    path: 'parent', select: 'name displayName wallet', populate: {
                        path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                    }
                }
            })
            .populate({
                path: "participantsRole",
                model: 'AccessRole',
                populate: {
                    path: "user",
                    select: 'parent parentModelName',
                    populate: {
                        path: 'parent',
                        select: 'name displayName wallet',
                        populate: {
                            path: 'displayPicture',
                            model: 'File',
                            select: 'url thumbUrl'
                        }
                    }
                }
            })
            .populate({
                path: 'groupDP',
                model: 'File',
                select: 'url thumbUrl'
            })

        conversation.topMessage = message

        const data = {
            messages: [message],
            conversation
        }

        const participants = conversation.participants.map(item => item._id)
        var participantSet = new Set(JSON.parse(JSON.stringify(participants)))
        var msgUser = '' + message.user

        participantSet.delete(msgUser)

        const diff = Array.from(participantSet)


        socketApi(req, diff, {
            type: 'onMessage',
            payload: data
        })

        res.status(200).json({
            data
        })

    } catch (error) {
        console.log(error, ' is the error an error')
        res.status(400).json({
            data: null,
            error: error
        })
    }

}

/**
 * 
 * @param {*} req
 * @param { Object } req.body
 * @param { String } req.body.userId 
 * @param { String } req.body.personId 
 * @param {*} res 
 */

const findMutualConversation = async (req, res) => {

    const userId = req.body.userId
    const personId = req.body.personId

    let conversations = await Conversation.find({
        participants: { $in: [userId, personId], $size: 2 }
    })
        .populate('topMessage')
        .populate({
            path: 'participants', select: 'parent parentModelName', populate: {
                path: 'parent', select: 'name displayName wallet', populate: {
                    path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                }
            }
        })
        .populate({
            path: "participantsRole",
            model: 'AccessRole',
            populate: {
                path: "user",
                select: 'parent parentModelName',
                populate: {
                    path: 'parent',
                    select: 'name displayName wallet',
                    populate: {
                        path: 'displayPicture',
                        model: 'File',
                        select: 'url thumbUrl'
                    }
                }
            }
        })
        .populate({
            path: 'groupDP',
            model: 'File',
            select: 'url thumbUrl'
        })
        .sort('-updatedAt')

    if (conversations.length > 0) {
        const conv = conversations[0]
        const messages = await Message.find({ conversation: conv._id })
            .sort('-createdAt')

        res.status(200).json({
            data: {
                conversation: conv,
                messages
            }
        })

    } else {

        res.status(200).json({
            data: null
        })

    }

}

const findProfileChat = async (req, res) => {
    const profileId = req.body.profileId

    try {
        if (ObjectId.isValid(profileId)) {

            const conversations = await Conversation.find({
                participants: { "$in": [profileId] },
                topMessage: { $exists: true }
            })
                .populate('topMessage')
                .populate({
                    path: 'participants',
                    select: 'parent parentModelName',
                    populate: {
                        path: 'parent',
                        select: 'name displayName wallet',
                        populate: {
                            path: 'displayPicture',
                            model: 'File',
                            select: 'url thumbUrl'
                        }
                    }
                })
                .populate({
                    path: "participantsRole",
                    model: 'AccessRole',
                    populate: {
                        path: "user",
                        select: 'parent parentModelName',
                        populate: {
                            path: 'parent',
                            select: 'name displayName wallet',
                            populate: {
                                path: 'displayPicture',
                                model: 'File',
                                select: 'url thumbUrl'
                            }
                        }
                    }
                })
                .populate({
                    path: 'groupDP',
                    model: 'File',
                    select: 'url thumbUrl'
                })
                .sort('-updatedAt')

            res.status(200).json({
                data: conversations
            })

        } else {
            return ({
                data: null,
                error: 'Not a valid id'
            })
        }
    } catch (error) {
        return ({
            data: null,
            error: error
        })
    }
}


const getConversationById = async (req, res) => {
    try {
        const conversationId = req.body.conversationId

        if (conversationId) {
            const conversations = await Conversation.find({ _id : conversationId })
                .populate('topMessage')
                .populate({
                    path: 'participants',
                    select: 'parent parentModelName',
                    populate: {
                        path: 'parent',
                        select: 'name displayName wallet',
                        populate: {
                            path: 'displayPicture',
                            model: 'File',
                            select: 'url thumbUrl'
                        }
                    }
                })
                .populate({
                    path: "participantsRole",
                    model: 'AccessRole',
                    populate: {
                        path: "user",
                        select: 'parent parentModelName',
                        populate: {
                            path: 'parent',
                            select: 'name displayName wallet',
                            populate: {
                                path: 'displayPicture',
                                model: 'File',
                                select: 'url thumbUrl'
                            }
                        }
                    }
                })
                .populate({
                    path: 'groupDP',
                    model: 'File',
                    select: 'url thumbUrl'
                })
                .sort('-updatedAt')

            res.status(200).json({
                data: conversations
            })

        } else {
            return ({
                data: null,
                error: 'Not a valid id'
            })
        }
    } catch (err) {
        return ({
            status: 400,
            data: null,
            err
        })
    }
}








const findUserChat = async (req, res) => {

    try {

        const conversations = await Conversation.find({
            participants: { "$in": [req.body.userId] }
        })
            .populate('topMessage')
            .populate({
                path: 'participants', select: 'parent parentModelName', populate: {
                    path: 'parent', select: 'name displayName wallet', populate: {
                        path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                    }
                }
            })
            .populate({
                path: "participantsRole",
                model: 'AccessRole',
                populate: {
                    path: "user",
                    select: 'parent parentModelName',
                    populate: {
                        path: 'parent',
                        select: 'name displayName wallet',
                        populate: {
                            path: 'displayPicture',
                            model: 'File',
                            select: 'url thumbUrl'
                        }
                    }
                }
            })
            .populate({
                path: 'groupDP',
                model: 'File',
                select: 'url thumbUrl'
            })
            .sort('-updatedAt')

        res.status(200).json({
            data: conversations
        })

    } catch (error) {

        res.status(400).json({
            data: null,
            error
        })

    }

}

const conversationDetail = async (req, res) => {

    try {

        var convId = req.body.conversationId;

        const messages = await Message.find({ conversation: convId })
            .populate('files')
            .sort('-createdAt')

        res.status(200).json({
            data: { messages }
        })

    } catch (error) {
        res.status(400).json({
            data: null,
            error
        })
    }

}

const getMoreMessages = async (req, res) => {
    try {

        let convId = req.body.conversationId;
        let timeOldest = req.body.timeOldest

        const messages = await Message.find({
            conversation: convId
        })
            .populate('files')


        // .sort('-createdAt')
        // .limit(30)

        // createdAt:{ $lt:timeOldest }

        res.status(200).json({
            data: { messages }
        })

    } catch (error) {
        res.status(400).json({
            data: null,
            error
        })
    }
}

const updateManyBotConvs = async () => {
    // const convs  = await Message.find({ type:'CustomerCareBot'})
    // let convIds = []
    // const newArr = convs.map(convBig => {
    //     let conv = convBig._doc
    //     let participants = conv.participants;
    //     let index = participants.indexOf('5eda2a828707d951356b82b7')
    //     const chatBotId = keys.chatBotId
    //     participants[index] = chatBotId
    //     convIds.push(conv._id)
    //     return {
    //         ...conv,
    //         creator: chatBotId,
    //         participants
    //     }
    // })

    // await Message.deleteMany({ _id: convIds})
    // const newConvs = await Message.insertMany(newArr)

    // console.log(convs, newArr,convIds, newConvs)
}

const deleteWrongConvs = async () => {
    let convsAll = await Conversation.find({}).populate('participants')

    let wrongConvs = []
    convsAll.map(convDoc => {
        const conv = convDoc._doc
        if (conv.participants.length < 2) {
            wrongConvs.push(conv._id)
        }
    })
    await Conversation.deleteMany({ _id: { $in: wrongConvs } })

    console.log(wrongConvs, ' is the wrongConvs')
}


const updateConversation = async (req, res) => {
    try {
        let convId = req.body._id
        let convObj = req.body

        let updatedConversation = await Conversation.findByIdAndUpdate(convId, convObj, { new: true })
            .populate('topMessage')
            .populate({
                path: 'participants',
                select: 'parent parentModelName',
                populate: {
                    path: 'parent',
                    select: 'name displayName wallet',
                    populate: {
                        path: 'displayPicture',
                        model: 'File',
                        select: 'url thumbUrl'
                    }
                }
            })
            .populate({
                path: "participantsRole",
                model: 'AccessRole',
                populate: {
                    path: "user",
                    select: 'parent parentModelName',
                    populate: {
                        path: 'parent',
                        select: 'name displayName wallet',
                        populate: {
                            path: 'displayPicture',
                            model: 'File',
                            select: 'url thumbUrl'
                        }
                    }
                }
            })
            .populate({
                path: 'groupDP',
                model: 'File',
                select: 'url thumbUrl'
            })
            .sort('-updatedAt')

        res.json({
            status: 200,
            data: updatedConversation
        })

    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err
        })
    }
}


const addParticipantsWithConversation = async (req, res) => {
    try {
        const participantsWithRole = req.body.participantsWithRole
        const conversationId = req.body.conversationId
        const oldParticipantIds = req.body.oldParticipantIds
        const oldParticipantWithRoleIds = req.body.oldParticipantWithRoleIds

        let msgWithRoleIdsArr = []
        let participantUserIds = []
        let accessRoleArr = []

        participantsWithRole.length > 0 && participantsWithRole.map((userRole) => {
            const accessRoleObj = new AccessRole({
                user: userRole.user._id,
                role: userRole.role,
                parent: conversationId,
                parentModelName: "Conversation",
                creator: req.body.user,
            })
            msgWithRoleIdsArr.push(accessRoleObj._id)
            participantUserIds.push(userRole.user._id)
            accessRoleArr.push(accessRoleObj)
        })

        let newParticipantIds = [...oldParticipantIds, ...participantUserIds]
        let newParticipantWithRoleIds = [...oldParticipantWithRoleIds, ...msgWithRoleIdsArr]


        const accessRoleRes = await AccessRole.insertMany(accessRoleArr);


        let updatedConversation = await Conversation.findByIdAndUpdate(
            conversationId,
            {
                participants: newParticipantIds,
                participantsRole: newParticipantWithRoleIds
            },
            { new: true })
            .populate('topMessage')
            .populate({
                path: 'participants',
                select: 'parent parentModelName',
                populate: {
                    path: 'parent',
                    select: 'name displayName wallet',
                    populate: {
                        path: 'displayPicture',
                        model: 'File',
                        select: 'url thumbUrl'
                    }
                }
            })
            .populate({
                path: "participantsRole",
                model: 'AccessRole',
                populate: {
                    path: "user",
                    select: 'parent parentModelName',
                    populate: {
                        path: 'parent',
                        select: 'name displayName wallet',
                        populate: {
                            path: 'displayPicture',
                            model: 'File',
                            select: 'url thumbUrl'
                        }
                    }
                }
            })
            .populate({
                path: 'groupDP',
                model: 'File',
                select: 'url thumbUrl'
            })
            .sort('-updatedAt')


        res.json({
            status: 400,
            data: {
                accessRoleRes,
                updatedConversation
            }
        })

    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err
        })
    }
}





















module.exports = {
    findOrCreateBotConversation,
    initConvHelper,
    initConv,
    findMutualConversation,
    findProfileChat,
    findUserChat,
    message,
    lastSeenHelper,
    conversationDetail,
    getMoreMessages,
    updateManyBotConvs,
    deleteWrongConvs,
    updateConversation,
    addParticipantsWithConversation,
    getConversationById
};
