'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

exports.default = {
    app: {
        port: process.env.PORT || 4000,
        host: process.env.HOST || 'localhost'
    },
    mongodb: {
        host: process.env.MONGO_DB_HOST || 'localhost',
        port: process.env.MONGO_DB_PORT || 27017,
        name: process.env.MONGO_DB_DATABASE || 'chat',
        connection: process.env.MONGO_DB_CONNECTION || 'mongodb'
    },
    mysql: {
        host: process.env.MYSQL_DB_HOST,
        database: process.env.MYSQL_DB_DATABASE,
        user: process.env.MYSQL_DB_USER,
        password: process.env.MYSQL_DB_PASSWORD
    }
};