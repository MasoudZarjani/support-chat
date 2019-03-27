'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseTimestamp = require('mongoose-timestamp');

var _mongooseTimestamp2 = _interopRequireDefault(_mongooseTimestamp);

var _mongoosePaginateV = require('mongoose-paginate-v2');

var _mongoosePaginateV2 = _interopRequireDefault(_mongoosePaginateV);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MessageSchema = new _mongoose2.default.Schema({
    title: {
        type: String
    },
    message: {
        type: String
    },
    from: {
        type: _mongoose2.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    to: {
        type: _mongoose2.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    chat_title_id: {
        type: Number
    },
    token: {
        type: String
    },
    type: {
        type: Number
    },
    seen: {
        type: Number
    }
});

MessageSchema.plugin(_mongooseTimestamp2.default);
MessageSchema.plugin(_mongoosePaginateV2.default);

exports.default = _mongoose2.default.model('Message', MessageSchema);