import express from 'express'
import config from './configs/app'

import socketIo from 'socket.io'
import http from 'http'
import socketEvents from './helpers/socket'

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
        new socketEvents(this.socket).socketEvents();
        this.http.listen(port, () => {
            console.log(`Listening on http://${host}:${port}`);
        });
    }
}

const app = new Server();
app.appRun();