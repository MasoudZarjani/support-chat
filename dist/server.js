'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _app = require('./configs/app');

var _app2 = _interopRequireDefault(_app);

var _db = require('./configs/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

//Listen app port
var port = _app2.default.app.port;


var server = app.listen(port, function () {
    console.log('Server running at Port ' + port);
});

var io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log(socket.id);
    socket.on('SEND_MESSAGE', function (data) {
        io.emit('MESSAGE', data);
    });
});