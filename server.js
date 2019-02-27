import express from 'express'
import config from './configs/app'
import mongoose from './configs/db'

const app = express();

const {
    app: {
        port
    }
} = config;

const server = app.listen(port, function() {
    console.log(`Server running at Port ${port}`);
});

const io = require('socket.io')(server);

io.on('connection', function(socket) {
    console.log(socket.id)
    socket.on('send_message', function(data) {
        
        io.emit('message', data)
    });
});