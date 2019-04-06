import fs from "fs";
import messageController from "../controllers/messageController";
import userController from "../controllers/userController";
import Utility from "../helpers/utility";
import constants from "../configs/constants";

class Socket {
    constructor(socket) {
        this.io = socket;
    }

    socketEvents() {
        let self = this.io;
        self.on("connection", socket => {
            let token = socket.handshake.query.token;
            console.log(`connected: ${token}`);

            //userController.onlineStatus(token, constants.user.onlineStatus.online)

            socket.on(`getAllMessage-${token}`, function (data) {
                userController.getUserApi(token).then(function (result) {
                    try {
                        messageController
                            .getMessages(result.id, data.page, data.chat_title_id)
                            .then(function (res) {
                                try {
                                    console.log(socket.emit(`sendAllMessage-${token}`, res));
                                } catch (err) {
                                    console.log(err);
                                }
                            });
                    } catch (err) {
                        console.log(err);
                    }
                });
            });

            //get admin messages list
            socket.on(`getMessages-${token}`, function (data) {
                userController.getUserApi(data.userToken).then(function (result) {
                    try {
                        messageController
                            .getMessages(result, data.page, data.chat_title_id)
                            .then(function (res) {
                                try {
                                    socket.emit(`sendMessages-${token}`, res);
                                } catch (err) {
                                    console.log(err);
                                }
                            });
                    } catch (err) {
                        console.log(err);
                    }
                });
            });

            socket.on(`sendImage-${token}`, function (data) {
                var fileName = __dirname + '/../../uploads/' + data.imageName;

                fs.open(fileName, 'a', function (err, fd) {
                    if (err) throw err;

                    fs.write(fd, data.filePath, null, 'Binary', function (err, written, buff) {
                        try {
                            fs.close(fd, function () {
                                messageController
                                    .setMessage(data, token)
                                    .then(function (res) {
                                        try {
                                            socket.emit(`ImageStatus-${token}`, {
                                                'status': true
                                            });
                                        } catch (err) {
                                            socket.emit(`ImageStatus-${token}`, err);
                                        }
                                    });
                            });
                        } catch (err) {
                            socket.emit(`ImageStatus-${token}`, err);
                        }
                    })
                });

            });

            socket.on(`sendMessage-${token}`, function (data) {
                console.log(data);
                messageController.setMessage(data, token).then(function (result) {
                    try {
                        let userToken = result.token;
                        self.emit(`getMessage-${userToken}`, {
                            id: result._id,
                            text: result.message,
                            createdAt: Utility.getPersianTime(result.createdAt),
                            type: result.type,
                            messageStatus: 1
                        });
                        console.log(data.id_msg);
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
                if (typeof data === "undefined") {
                    self.emit(`typing-admin`, {
                        typing: null
                    });
                } else {
                    let id = data.id;
                    userController.getToken(id).then(function (result) {
                        try {
                            let userToken = result.token;
                            console.log(userToken);
                            self.emit(`typing-${userToken}`);
                        } catch (err) {}
                    });
                }
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
                //userController.onlineStatus(token, constants.user.onlineStatus.offline)
            });
        });
    }
}

export default Socket;