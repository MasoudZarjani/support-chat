'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Message = require('../models/Message');

var _Message2 = _interopRequireDefault(_Message);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var messageController = function () {
    function messageController() {
        _classCallCheck(this, messageController);
    }

    _createClass(messageController, [{
        key: 'getMessages',
        value: async function getMessages(id) {
            try {
                var MessageList = [];
                var messages = await _Message2.default.find({
                    $or: [{
                        from: id
                    }, {
                        to: id
                    }]
                }).sort('createdAt');
                messages.forEach(function (message) {
                    MessageList.push({
                        id: message._id,
                        text: message.message
                    });
                });
                return MessageList;
            } catch (err) {
                console.warn(err);
                return null;
            }
        }
    }]);

    return messageController;
}();

exports.default = new messageController();