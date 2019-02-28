import express from 'express'
import config from './configs/app'
import mongoose from './configs/db'
import socketIo from 'socket.io'
const socketEvents = require('./helpers/socket').default;
const http = require('http');

const {
    app: {
        port,
        host
    }
} = config;

class Server {
    constructor() {
        this.app = express();
        this.http = http.Server(this.app);
        this.socket = socketIo(this.http);
    }

    appRun() {
        new socketEvents(this.socket);
        this.http.listen(port, () => {
            console.log(`Listening on port = ${port}`);
        });
    }
}

const app = new Server();
app.appRun();