import fs from 'fs'
import messageController from '../controllers/messageController'

class Socket {
    constructor(socket) {
        this.io = socket;
    }

    socketEvents() {
        this.io.on("connection", socket => {
            let token = socket.handshake.query.token;

            //get messages list
            socket.on(`getMessages-${token}`, function (data) {
                console.log(data)
                messageController.getMessages(data.id).then(function (result) {
                    socket.emit(`sendMessages-${token}`, result);
                })
            });

            //send message from admin to a user
            socket.on("sendMessage", function (data) {
                let token = data.token;
                socket.emit(`getMessage-${token}`, data);
            });

            //send message from user to admins
            socket.on(`sendMessage-${token}`, function (data) {
                console.log(data);
                socket.emit(`getMessage-${token}`, data);
            });

            //get file and save in uploads folder
            socket.on(`sendFile-${token}`, function (data) {
                //use fs.writeFile
                data = data.image;
                data = data.replace(/^data:image\/png;base64,/, "");

                fs.writeFile("out.png", data, 'base64', function (err) {
                    console.log(err);
                });

                socket.emit(`getMessage-${token}`, {
                    sendMessage: 'ok'
                });
            });

            socket.on("disconnect", async () => {
                socket.emit("chatListRes", {
                    userDisconnected: true,
                    socket_id: socket.id
                });
            });
        });
    }
}

export default Socket;