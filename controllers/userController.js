import User from '../models/User';

class userController {
    async getUser(token) {
        try {
            return await User.findOne({
                token: token
            })
        } catch (err) {
            console.warn(err);
            return null;
        }
    }

    //api
    async setUser(req, res) {
        try {
            let user = new userController();
            let userCheck = await user.getUser(req.body.token)
            if (typeof userCheck === 'undefined' || userCheck == null) {
                new User({
                    name: req.body.name,
                    family: req.body.family,
                    token: req.body.token,
                    avatar: req.body.avatar,
                    type: req.body.type //user=0, admin=1
                }).save(function (err) {
                    if (err) throw err;
                })
                res.json({
                    status: true
                })
            } else {
                res.json({
                    status: true
                })
            }
        } catch (err) {
            res.status(500).json({
                data: err.message,
                status: 'error'
            })
        }
    }

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