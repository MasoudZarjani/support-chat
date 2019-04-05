'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _constants = require('../configs/constants');

var _constants2 = _interopRequireDefault(_constants);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var userController = function () {
    function userController() {
        _classCallCheck(this, userController);
    }

    _createClass(userController, [{
        key: 'getUserApi',
        value: async function getUserApi(token) {
            return await _axios2.default.post('http://app.mahanteymouri.ir/mahant-api/private/getUserId', {
                token: token
            }).then(function (response) {
                // handle success
                if (response.data.status === true) return response.data.id;
            }).catch(function (error) {
                // handle error
                console.log(error);
            });
        }
    }, {
        key: 'getUsersApi',
        value: async function getUsersApi(req, res, next) {
            await _axios2.default.post('http://app.mahanteymouri.ir/mahant-api/private/getAllUserHastChat', {
                token: 'iZQEbfTRBNGke1wxuQS65oJQRTcGh08no3XBHle31AhvPRen7BhsyycQqKFaKYsvVu15SIf1ZMcLuIcz2TR0oKCA5LTS4df2g2XsZ44xs44PhqzeJv9us8CTGvyZUaOELKgrfEZ1siQPp8YRzGnp3f'
            }).then(function (response) {
                if (response.data.status === true) res.send(response.data.data);
            }).catch(function (error) {
                console.log(error);
            });
        }
    }, {
        key: 'getChatTitlesApi',
        value: async function getChatTitlesApi(req, res, next) {
            await _axios2.default.post('http://app.mahanteymouri.ir/mahant-api/v1/getChatTitles', {
                token: req.params.token
            }).then(function (response) {
                if (response.data.status === true) res.send(response.data.data);
            }).catch(function (error) {
                console.log(error);
            });
        }
    }, {
        key: 'getAdminInfoApi',
        value: async function getAdminInfoApi(req, res, next) {
            await _axios2.default.get('http://app.mahanteymouri.ir/mahant/get-info').then(function (response) {
                if (response.data.status === true) res.send(response.data.data);
            }).catch(function (error) {
                console.log(error);
            });
        }
    }, {
        key: 'getUser',
        value: async function getUser(token) {
            try {
                return await _User2.default.findOne({
                    token: token
                });
            } catch (err) {
                console.warn(err);
                return null;
            }
        }
    }, {
        key: 'getAdmin',
        value: async function getAdmin() {
            try {
                return await _User2.default.findOne({
                    token: "admin"
                });
            } catch (err) {
                console.warn(err);
                return null;
            }
        }
    }, {
        key: 'getToken',
        value: async function getToken(id) {
            try {
                return await _User2.default.findOne({
                    _id: id
                });
            } catch (err) {
                console.warn(err);
                return null;
            }
        }
    }, {
        key: 'onlineStatus',
        value: async function onlineStatus(token, status) {
            try {
                return await _User2.default.updateOne({
                    token: token
                }, {
                    onlineStatus: status
                });
            } catch (err) {
                console.warn(err);
                return null;
            }
        }

        //api

    }, {
        key: 'setUser',
        value: async function setUser(req, res) {
            try {
                var user = new userController();
                var userCheck = await user.getUser(req.body.token);
                if (typeof userCheck === 'undefined' || userCheck == null) {
                    new _User2.default({
                        name: req.body.name,
                        family: req.body.family,
                        token: req.body.token,
                        avatar: req.body.avatar,
                        type: req.body.type, //user=0, admin=1
                        onlineStatus: _constants2.default.user.onlineStatus.online
                    }).save(function (err) {
                        if (err) throw err;
                    });
                }
                res.json({
                    status: true
                });
            } catch (err) {
                res.status(500).json({
                    data: err.message,
                    status: 'error'
                });
            }
        }
    }, {
        key: 'getUsers',
        value: async function getUsers(req, res, next) {
            try {
                var UserList = [];
                var Users = await _User2.default.find({
                    token: {
                        $ne: 'admin'
                    }
                });
                Users.forEach(function (User) {
                    if (typeof User.avatar === 'undefined') {
                        User.avatar = process.env.APP_URL + "/assets/default-avatar.jpg";
                    }
                    UserList.push({
                        id: User._id,
                        name: User.name + "  " + User.family,
                        avatar: User.avatar,
                        onlineStatus: User.onlineStatus
                    });
                });
                res.json(UserList);
            } catch (err) {
                res.status(500).json({
                    data: err.message,
                    status: 'error'
                });
            }
        }
    }]);

    return userController;
}();

exports.default = new userController();