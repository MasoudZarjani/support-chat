"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Message = require("../models/Message");

var _Message2 = _interopRequireDefault(_Message);

var _User = require("../models/User");

var _User2 = _interopRequireDefault(_User);

var _constants = require("../configs/constants");

var _constants2 = _interopRequireDefault(_constants);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _utility = require("../helpers/utility");

var _utility2 = _interopRequireDefault(_utility);

var _userController = require("./userController");

var _userController2 = _interopRequireDefault(_userController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var messageController = function () {
  function messageController() {
    _classCallCheck(this, messageController);
  }

  _createClass(messageController, [{
    key: "getMessages",
    value: async function getMessages(token, page) {
      try {
        var _constants$message = _constants2.default.message,
            receiver = _constants$message.receiver,
            sender = _constants$message.sender;

        var messageStatus = 0;
        var options = {
          sort: {
            createdAt: -1
          },
          lean: true,
          page: page,
          limit: 10
        };
        var messages = await _Message2.default.paginate({
          $or: [{ from: token }, { to: token }]
        }, options);
        messages.docs = _lodash2.default.reverse(messages.docs);
        messages.docs = _lodash2.default.map(messages.docs, function (item) {
          if (item.from == token) {
            messageStatus = sender;
          } else {
            _Message2.default.findOneAndUpdate({
              _id: item._id
            }, {
              $set: {
                seen: 1
              }
            }, {
              new: true,
              useFindAndModify: false
            }, function (err, doc) {
              if (err) {
                console.log("Something wrong when updating data!");
              }
              item.seen = doc.seen;
            });
            messageStatus = receiver;
          }
          return {
            messageStatus: messageStatus,
            id: item._id,
            createdAt: _utility2.default.getPersianTime(item.createdAt),
            text: item.message,
            type: item.type,
            seen: item.seen,
            file: item.file,
            date: _utility2.default.getPersianDate(item.createdAt)
          };
        });
        return messages;
      } catch (err) {
        console.warn(err);
        return null;
      }
    }
  }, {
    key: "getAllMessage",
    value: async function getAllMessage(token, page) {
      try {
        var _constants$message2 = _constants2.default.message,
            receiver = _constants$message2.receiver,
            sender = _constants$message2.sender;

        var messageStatus = 0;
        var options = {
          sort: {
            createdAt: 1
          },
          lean: true,
          page: page,
          limit: 10
        };
        var messages = await _Message2.default.find({
          token: token
        });
        messages.docs = _lodash2.default.map(messages, function (item) {
          if (item.from == token) {
            messageStatus = sender;
          } else {
            _Message2.default.findOneAndUpdate({
              _id: item._id
            }, {
              $set: {
                seen: 1
              }
            }, {
              new: true,
              useFindAndModify: false
            }, function (err, doc) {
              if (err) {
                console.log("Something wrong when updating data!");
              }
              item.seen = doc.seen;
            });
            messageStatus = receiver;
          }
          owner = false;
          if (item.token == item.from) owner = true;
          return {
            messageStatus: messageStatus,
            id: item._id,
            createdAt: _utility2.default.getPersianTime(item.createdAt),
            text: item.message,
            type: item.type,
            seen: item.seen,
            file: item.file,
            date: _utility2.default.getPersianDate(item.createdAt),
            owner: owner
          };
        });
        return {
          docs: messages
        };
      } catch (err) {
        console.warn(err);
        return null;
      }
    }
  }, {
    key: "setMessage",
    value: async function setMessage(data, token) {
      try {
        if (typeof data.userToken === "undefined" || data.userToken == null) {
          data.userToken = "138d902d-9fc4-4ddf-a323-3bc89e5b0061";
        }

        if (data.type == 0) {
          return new _Message2.default({
            message: data.text,
            from: token,
            to: data.userToken,
            type: data.type,
            seen: 0
          }).save();
        } else if (data.type == 1) {
          return new _Message2.default({
            message: data.text,
            from: token,
            to: data.userToken,
            type: data.type,
            file: {
              path: data.fileName,
              mime: data.fileType,
              size: data.fileSize
            },
            seen: 0
          }).save();
        }
      } catch (err) {
        console.warn(err);
        return null;
      }
    }
  }, {
    key: "getAllMessages",
    value: async function getAllMessages() {
      try {
        var messages = await _Message2.default.find().sort("createdAt");
        res.json(messages);
      } catch (err) {
        console.warn(err);
        return null;
      }
    }
  }]);

  return messageController;
}();

exports.default = new messageController();