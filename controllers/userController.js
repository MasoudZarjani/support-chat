import Message from '../models/Message';
import User from '../models/User';

export async function getMessage(req, res) {
    let token = req.params.token;
    let users = await User.find({
        token
    });
    let uid = users[0]._id;
    await Message.find({
        user: uid
    }).sort('_id');
}