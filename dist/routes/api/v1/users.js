'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _userController = require('../../../controllers/userController');

var _userController2 = _interopRequireDefault(_userController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/index', _userController2.default.getUsersApi);
router.get('/admin/info', _userController2.default.getAdminInfoApi);
router.get('/chat_titles/:token', _userController2.default.getChatTitlesApi);

exports.default = router;