import User from '../models/User';

class userController {
    async getUser(token) {
        try {
            return await Users.findOne({token: token})
        } catch (err) {
            console.warn(err);
            return null;
        }
    }

    //api
    async getUsers(req, res, next) {
        try {
            let UserList = []
            let Users = await User.find({
                token: {
                    $ne: 'admin'
                }
            })
            Users.forEach(User => {
                if (typeof User.avatar === 'undefined') {
                    User.avatar = process.env.APP_URL + "/assets/default-avatar.jpg"
                }
                UserList.push({
                    id: User._id,
                    name: User.name + "  " + User.family,
                    avatar: User.avatar
                })
            });
            res.json(UserList)
        } catch (err) {
            res.status(500).json({
                data: err.message,
                status: 'error'
            })
        }
    }
}

export default new userController();