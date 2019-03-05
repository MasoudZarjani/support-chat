'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _messageController = require('../../../controllers/messageController');

var _messageController2 = _interopRequireDefault(_messageController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/index', _messageController2.default.getMessageFromUser);

exports.default = router;