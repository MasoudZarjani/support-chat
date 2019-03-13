import fs from "fs";
import messageController from "../controllers/messageController";
import userController from "../controllers/userController";
import Utility from "../helpers/utility";

const utility = new Utility();

class Socket {
    constructor(socket) {
        this.io = socket;
    }

    socketEvents() {
        let self = this.io
        self.on("connection", socket => {
            let token = socket.handshake.query.token;
            console.log(`connected: ${token}`);

            //get admin messages list
            socket.on(`getMessages-${token}`, function (data) {
                if (typeof data.id === "undefined") {
                    user = userController.getUser(token);
                    data = {
                        id: user.id
                    };
                }
                messageController.getMessages(data.id).then(function (result) {
                    socket.emit(`sendMessages-${token}`, result);
                });
            });

            socket.on(`sendMessage-${token}`, function (data) {
                messageController.getMessage(data, token).then(function (result) {
                    try {
                        let userToken = result.token;
                        self.emit(`getMessage-${userToken}`, {
                            id: result._id,
                            text: result.message,
                            createdAt: utility.getPersianDate(result.createdAt),
                            type: result.type,
                            messageStatus: 0,
                        });
                        socket.emit(`received-${token}`, {
                            id_msg: data.id_msg,
                            status: true
                        });
                    } catch (err) {
                        console.log(err);
                    }
                });
            });

            //get file and save in uploads folder
            socket.on(`sendFile-${token}`, function (data) {
                //use fs.writeFile
                data = data.image;
                data = data.replace(/^data:image\/png;base64,/, "");

                fs.writeFile("out.png", data, "base64", function (err) {
                    console.log(err);
                });

                socket.emit(`getMessage-${token}`, {
                    sendMessage: "ok"
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