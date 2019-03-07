import Message from '../models/Message';
import User from '../models/User';
import constants from '../configs/constants';

class messageController {
    async getMessages(id) {
        try {
            console.log('asd')
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
                    type: 'text', //text, file, special
                    file: {
                        path : '',
                        size: '',
                        detail: ''
                    },
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
            let user = await User.find({
                token
            });
            new Message({
                message: data.text,
                from: user._id,
                to: data.id
            }).save(function (err) {
                if (err) throw err;
            });
            return true;
        } catch (err) {
            console.warn(err);
            return null;
        }
    }
}

export default new messageController();