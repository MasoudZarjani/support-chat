import express from 'express'
import config from './configs/app'
import {
    mongodb,
    mysqldb
} from './configs/db'
import socketIo from 'socket.io'
import http from 'http'
import bodyParser from 'body-parser'
import cors from 'cors'

import socketEvents from './helpers/socket'
import router from './routes/api'

const {
    app: {
        port,
        host
    }
} = config;


class Server {
    constructor() {
        mongodb();

        this.app = express()
        this.app.use('/assets', express.static(__dirname + '/assets'));
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({
            extended: true
        }))
        this.app.use(cors())
        this.app.use(function (req, res, next) {
            res.set('Access-Control-Allow-Origin', req.headers.origin)
            res.set('Access-Control-Allow-Credentials', 'true')
            next();
        });
        this.http = http.Server(this.app)
        this.socket = socketIo(this.http)
        this.app.use(router)
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