'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseTimestamp = require('mongoose-timestamp');

var _mongooseTimestamp2 = _interopRequireDefault(_mongooseTimestamp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserSchema = new _mongoose2.default.Schema({
    title: {
        type: String
    },
    message: {
        type: String
    },
    from: {
        type: String
    },
    to: {
        type: String
    }
});

PostSchema.plugin(_mongooseTimestamp2.default);

exports.default = _mongoose2.default.model('User', UserSchema);