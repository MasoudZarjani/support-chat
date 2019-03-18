import fs from "fs";
import messageController from "../controllers/messageController";
import userController from "../controllers/userController";
import Utility from "../helpers/utility";
import constants from '../configs/constants';

class Socket {
    constructor(socket) {
        this.io = socket;
    }

    socketEvents() {
        let self = this.io
        self.on("connection", socket => {
            let token = socket.handshake.query.token;
            console.log(`connected: ${token}`);

            userController.onlineStatus(token, constants.user.onlineStatus.online)

            socket.on(`getAllMessage-${token}`, function (data) {
                userController.getUser(token).then(function (result) {
                    try {
                        messageController.getMessages(result._id, data.page).then(function (res) {
                            try {
                                socket.emit(`sendAllMessage-${token}`, res);
                            } catch (err) {
                                console.log(err);
                            }
                        });
                    } catch (err) {
                        console.log(err);
                    }
                })
            });

            //get admin messages list
            socket.on(`getMessages-${token}`, function (data) {
                if (typeof data.id === "undefined") {
                    user = userController.getUser(token);
                    data = {
                        id: user.id
                    };
                }
                messageController.getMessages(data.id, data.page).then(function (result) {
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
                            createdAt: Utility.getPersianTime(result.createdAt),
                            type: result.type,
                            messageStatus: 1,
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

            socket.on(`typing-${token}`, function (data) {
                if (typeof data === 'undefined') {
                    self.emit(`typing-admin`, {
                        typing: null
                    })
                } else {
                    let id = data.id
                    userController.getToken(id).then(function (result) {
                        try {
                            let userToken = result.token
                            console.log(userToken)
                            self.emit(`typing-${userToken}`);
                        } catch (err) {

                        }
                    })
                }

            })

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
                userController.onlineStatus(token, constants.user.onlineStatus.offline)
            });
        });
    }
}

export default Socket;