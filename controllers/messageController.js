import Message from '../models/Message';
import User from '../models/User';
import constants from '../configs/constants';

class messageController {
    async getMessages(id) {
        try {
            const {
                message: {
                    receiver,
                    sender,
                }
            } = constants;
            let messageStatus = 0;
            let MessageList = [];
            let messages = await Message.find({
                $or: [{
                    from: id
                }, {
                    to: id
                }]
            }).sort('createdAt')
            messages.forEach(message => {
                if (message.from == id) {
                    messageStatus = sender
                } else {
                    messageStatus = receiver
                }
                MessageList.push({
                    id: message._id,
                    text: message.message,
                    createdAt: message.createdAt,
                    messageStatus: messageStatus,
                    type: 0,
                    seen: 0
                })
            });
            return MessageList
        } catch (err) {
            console.warn(err);
            return null;
        }
    }

    async getMessage(data, token) {
        try {
            let user = await User.findOne({
                token
            });
            
            if (typeof data.id === 'undefined') {
                data.id = "5c8621fbfa3a65776cda5377"
            }

            let userToken = await User.findOne({
                _id: data.id
            });

            return new Message({
                message: data.text,
                from: user._id,
                to: data.id,
                type: data.type,
                token: userToken.token
            }).save()

        } catch (err) {
            console.warn(err);
            return null;
        }
    }

    async getAllMessages() {
        try {
            let messages = await Message.find().sort('createdAt');
            res.json(messages)
        } catch (err) {
            console.warn(err);
            return null;
        }
    }
}

export default new messageController();