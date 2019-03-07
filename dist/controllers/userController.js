'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var userController = function () {
    function userController() {
        _classCallCheck(this, userController);
    }

    _createClass(userController, [{
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

        //api

    }, {
        key: 'setUser',
        value: async function setUser(req, res) {
            try {
                var user = new userController();
                var userCheck = await user.getUser(req.body.token);
                console.log(userCheck);
                if (typeof userCheck === 'undefined' || userCheck == null) {
                    new _User2.default({
                        name: req.body.name,
                        family: req.body.family,
                        token: req.body.token,
                        avatar: req.body.avatar,
                        type: req.body.type //user=0, admin=1
                    }).save(function (err) {
                        if (err) throw err;
                    });
                    res.json({
                        status: true
                    });
                } else {
                    res.json({
                        status: true
                    });
                }
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
                        avatar: User.avatar
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