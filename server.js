import express from 'express'
import config from './configs/app'
import {
    mongodb,
    mysqldb
} from './configs/db'
import socketIo from 'socket.io'
import http from 'http'
import socketEvents from './helpers/socket'
import cors from 'cors'

const {
    app: {
        port,
        host
    }
} = config;




class Server {
    constructor() {
        mongodb();

        this.app = express();
        this.app.use(cors())
        this.http = http.Server(this.app);
        this.socket = socketIo(this.http);
        this.app.get('/users', function (req, res) {
            res.set('Access-Control-Allow-Origin',  req.headers.origin)
            res.set('Access-Control-Allow-Credentials', 'true')
            res.send('Ok')
        })
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