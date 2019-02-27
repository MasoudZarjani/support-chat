'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _config$db = _app2.default.db,
    host = _config$db.host,
    port = _config$db.port,
    name = _config$db.name,
    connection = _config$db.connection;


var connectionString = connection + '://' + host + ':' + port + '/' + name;
_mongoose2.default.Promise = global.Promise;
_mongoose2.default.connect(connectionString, {
    useNewUrlParser: true
}, function (err) {
    if (!err) console.log('MongoDB Connection Succeeded');else console.log('Error in DB Connection: '.JSON.stringify(err, undefined, 2));
});

module.exports = _mongoose2.default;