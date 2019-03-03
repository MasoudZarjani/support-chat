'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mysqldb = exports.mongodb = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongodb = exports.mongodb = function mongodb() {
    var _config$mongodb = _app2.default.mongodb,
        host = _config$mongodb.host,
        port = _config$mongodb.port,
        name = _config$mongodb.name,
        connection = _config$mongodb.connection;


    var connectionString = connection + '://' + host + ':' + port + '/' + name;
    _mongoose2.default.Promise = global.Promise;
    _mongoose2.default.connect(connectionString, {
        useNewUrlParser: true
    }, function (err) {
        if (!err) console.log('MongoDB Connection Succeeded');else console.log('Error in DB Connection: '.JSON.stringify(err, undefined, 2));
    });
};

var mysqldb = exports.mysqldb = function mysqldb() {
    var _config$mysql = _app2.default.mysql,
        host = _config$mysql.host,
        database = _config$mysql.database,
        user = _config$mysql.user,
        password = _config$mysql.password;


    var db = _mysql2.default.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
    });

    db.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log('Mysql Connection Succeeded');
    });
    global.db = db;
};