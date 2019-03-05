import fs from 'fs'
class Socket {
    constructor(socket) {
        this.io = socket;
    }

    socketEvents() {
        this.io.on("connection", socket => {
            let token = socket.handshake.query.token;
            console.log(token);
            console.log("user connect");

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
                console.log(" image response: " + data)
                //use fs.writeFile

                data = data.replace(/^data:image\/png;base64,/, "");

                fs.writeFile("out.png", data, 'base64', function (err) {
                    console.log(err);
                });
                
                socket.emit(`getMessage-${token}`, {
                    data: 'ok'
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