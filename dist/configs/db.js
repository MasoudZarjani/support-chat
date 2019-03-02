'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mongodb = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _config$mongodb = _app2.default.mongodb,
    host = _config$mongodb.host,
    port = _config$mongodb.port,
    name = _config$mongodb.name,
    connection = _config$mongodb.connection;


var connectionString = connection + '://' + host + ':' + port + '/' + name;
_mongoose2.default.Promise = global.Promise;

var mongodb = exports.mongodb = function mongodb() {
    return _mongoose2.default.connect(connectionString, {
        useNewUrlParser: true
    }, function (err) {
        if (!err) console.log('MongoDB Connection Succeeded');else console.log('Error in DB Connection: '.JSON.stringify(err, undefined, 2));
    });
};