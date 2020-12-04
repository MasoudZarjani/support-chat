import express from "express";
import config from "./configs/app";
import { mongodb, mysqldb } from "./configs/db";
import socketIo from "socket.io";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";

import socketEvents from "./helpers/socket";
import router from "./routes/api";

const {
  app: { port, host },
} = config;

class Server {
  constructor() {
    mongodb();
    this.app = express();
    this.app.use("/assets", express.static(__dirname + "/assets"));
    this.app.use(
      bodyParser.urlencoded({
        extended: false,
      })
    );
    this.app.use(
      bodyParser.json({
        type: "application/json",
      })
    );
    this.app.get("/", (req, res) => {
      res.sendFile(__dirname + "/index.html");
    });
    this.app.use(cors());
    this.app.use(function (req, res, next) {
      // Website you wish to allow to connect
      res.setHeader("Access-Control-Allow-Origin", req.headers.origin);

      // Request headers you wish to allow
      res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
      );

      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader("Access-Control-Allow-Credentials", true);
      next();
    });
    this.http = http.Server(this.app);
    this.socket = socketIo(this.http);
    this.app.use(router);
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
