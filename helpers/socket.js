class Socket {
    constructor(socket) {
        this.io = socket;
    }

    socketEvents() {
        this.io.on("connection", socket => {
            let token = socket.handshake.query.token
            console.log(token)
            console.log("user connect");

            //send message from admin to a user
            socket.on("sendMessage", function (data) {
                let token = data.token;
                socket.emit(`getMessage-${token}`, data);
            });

            //send message from user to admins
            socket.on(`sendMessage-${token}`, function (data) {
                console.log(data);
                socket.emit("getMessage", {
                    token,
                    data
                });
            });

            socket.on("GetUsersList", function (data) {});

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