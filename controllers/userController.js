import User from '../models/User';

class userController {
    async getUser(req, res, next) {
        try {
            let UserList = []
            let Users = await User.find()
            Users.forEach(User => {
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