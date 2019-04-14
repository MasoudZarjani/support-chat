import User from '../models/User';
import constants from '../configs/constants';
import axios from 'axios';
class userController {
    async getUserApi(token) {
        return await axios.post('http://app.mahanteymouri.ir/mahant-api/private/getUserId', {
                token: token
            })
            .then(function (response) {
                // handle success
                if (response.data.status === true)
                    return response.data.id
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }

    async getAdminApi(token) {
        return await axios.post('http://app.mahanteymouri.ir/mahant-api/private/getAdminId', {
                token: token
            })
            .then(function (response) {
                // handle success
                if (response.data.status === true)
                    return response.data.id
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }

    async getUsersApi(req, res, next) {
        await axios.post('http://app.mahanteymouri.ir/mahant-api/private/getAllUserHastChat', {
                token: 'iZQEbfTRBNGke1wxuQS65oJQRTcGh08no3XBHle31AhvPRen7BhsyycQqKFaKYsvVu15SIf1ZMcLuIcz2TR0oKCA5LTS4df2g2XsZ44xs44PhqzeJv9us8CTGvyZUaOELKgrfEZ1siQPp8YRzGnp3f'
            })
            .then(function (response) {
                if (response.data.status === true)
                    res.send(response.data.data)
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    async getChatTitlesApi(req, res, next) {
        await axios.post('http://app.mahanteymouri.ir/mahant-api/v1/getChatTitles', {
                token: req.params.token
            })
            .then(function (response) {
                if (response.data.status === true)
                    res.send(response.data.data)
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    async getAdminInfoApi(req, res, next) {
        await axios.get('http://app.mahanteymouri.ir/mahant/get-info')
            .then(function (response) {
                console.log(response.data.data)

                if (response.data.status === true)
                    res.send(response.data.data)
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    async updateOnlineUser(token, status) {
        await axios.post('http://app.mahanteymouri.ir/mahant-api/private/updateOnlineChatStatus', {
                status: status,
                token: token
            })
            .then(function (response) {
                if (response.data.status === true)
                    return true
                else
                    return false
            })
            .catch(function (error) {
                console.log(error);
            })
    }

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

    async getAdmin() {
        try {
            return await User.findOne({
                token: "admin"
            })
        } catch (err) {
            console.warn(err);
            return null;
        }
    }

    async getToken(id) {
        try {
            return await User.findOne({
                _id: id
            })
        } catch (err) {
            console.warn(err);
            return null;
        }
    }

    async onlineStatus(token, status) {
        try {
            return await User.updateOne({
                token: token
            }, {
                onlineStatus: status
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
                    type: req.body.type, //user=0, admin=1
                    onlineStatus: constants.user.onlineStatus.online
                }).save(function (err) {
                    if (err) throw err;
                })
            }
            res.json({
                status: true
            })
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
                    avatar: User.avatar,
                    onlineStatus: User.onlineStatus
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