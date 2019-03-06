'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _app = require('./configs/app');

var _app2 = _interopRequireDefault(_app);

var _db = require('./configs/db');

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _socket3 = require('./helpers/socket');

var _socket4 = _interopRequireDefault(_socket3);

var _api = require('./routes/api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _config$app = _app2.default.app,
    port = _config$app.port,
    host = _config$app.host;

var Server = function () {
    function Server() {
        _classCallCheck(this, Server);

        (0, _db.mongodb)();

        this.app = (0, _express2.default)();
        this.app.use('/assets', _express2.default.static(__dirname + '/assets'));
        this.app.use(_bodyParser2.default.json());
        this.app.use(_bodyParser2.default.urlencoded({
            extended: true
        }));
        this.app.use((0, _cors2.default)());
        this.app.use(function (req, res, next) {
            res.set('Access-Control-Allow-Origin', req.headers.origin);
            res.set('Access-Control-Allow-Credentials', 'true');
            next();
        });
        this.http = _http2.default.Server(this.app);
        this.socket = (0, _socket2.default)(this.http);
        this.app.use(_api2.default);
    }

    _createClass(Server, [{
        key: 'appRun',
        value: function appRun() {
            new _socket4.default(this.socket).socketEvents();
            this.http.listen(port, function () {
                console.log('Listening on http://' + host + ':' + port);
            });
        }
    }]);

    return Server;
}();

var app = new Server();
app.appRun();