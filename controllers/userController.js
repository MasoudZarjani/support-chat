import User from '../models/User';

class userController {
    async getUser(req, res, next) {
        try {
            let Users = await User.find()
            res.json(Users)
        } catch (err) {
            res.status(500).json({
                data: err.message,
                status: 'error'
            })
        }
    }
}

export default new userController();