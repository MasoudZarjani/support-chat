'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _app = require('./configs/app');

var _app2 = _interopRequireDefault(_app);

var _db = require('./configs/db');

var _db2 = _interopRequireDefault(_db);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var socketEvents = require('./helpers/socket').default;
var http = require('http');

var _config$app = _app2.default.app,
    port = _config$app.port,
    host = _config$app.host;

var Server = function () {
    function Server() {
        _classCallCheck(this, Server);

        this.app = (0, _express2.default)();
        this.http = http.Server(this.app);
        this.socket = (0, _socket2.default)(this.http);
    }

    _createClass(Server, [{
        key: 'appRun',
        value: function appRun() {
            new socketEvents(this.socket);
            this.http.listen(port, function () {
                console.log('Listening on port = ' + port);
            });
        }
    }]);

    return Server;
}();

var app = new Server();
app.appRun();