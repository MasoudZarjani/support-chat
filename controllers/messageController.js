import Message from '../models/Message';
import User from '../models/User';
import constants from '../configs/constants';
import _ from 'lodash';
import Utility from '../helpers/utility';

class messageController {
    async getMessages(id, page, chat_title_id) {
        try {
            const {
                message: {
                    receiver,
                    sender,
                }
            } = constants;
            let messageStatus = 0;
            var options = {
                sort: {
                    createdAt: -1
                },
                lean: true,
                page: page,
                limit: 10
            };
            let messages = await Message.paginate({
                chat_title_id: chat_title_id,
            }, options)

            messages.docs = _.map(messages.docs, item => {
                if (item.from == id) {
                    messageStatus = sender
                } else {
                    messageStatus = receiver
                }
                return {
                    messageStatus: messageStatus,
                    id: item._id,
                    createdAt: Utility.getPersianTime(item.createdAt),
                    text: item.message,
                    type: 0,
                    seen: 0,
                    date: Utility.getPersianDate(item.createdAt)
                }
            })
            return messages
        } catch (err) {
            console.warn(err);
            return null;
        }
    }

    async setMessage(data, token) {
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
                chat_title_id: data.chat_title_id,
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