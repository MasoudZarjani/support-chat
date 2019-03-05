import Message from '../models/Message';
import User from '../models/User';

class messageController {
    async getMessages(id) {
        try {
            let MessageList = []
            let messages = await Message.find({
                $or: [{
                    from: id
                }, {
                    to: id
                }]
            }).sort('createdAt')
            messages.forEach(message => {
                MessageList.push({
                    id: message._id,
                    text: message.message
                })
            });
            return MessageList
        } catch (err) {
            console.warn(err);
            return null;
        }
    }
}

export default new messageController();