import Message from '../models/Message';
import User from '../models/User';
import constants from '../configs/constants';
import _ from 'lodash';
import Utility from '../helpers/utility';
import userController from './userController';

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
            let from = await userController.getUserApi(token);
            console.log(from);
            let to = await userController.getUserApi(data.token);
            console.log(to);
            return new Message({
                chat_title_id: data.chat_title_id,
                message: data.text,
                from: from,
                to: to,
                type: data.type,
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