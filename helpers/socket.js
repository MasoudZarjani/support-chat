import fs from "fs";
import messageController from "../controllers/messageController";
import userController from "../controllers/userController";
import Utility from "../helpers/utility";
import constants from "../configs/constants";
import _ from 'lodash';

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
                messageController
                    .getMessages(token, data.page, data.chat_title_id)
                    .then(function (res) {
                        try {
                            console.log(res)
                            socket.emit(`sendAllMessage-${token}`, res);
                        } catch (err) {
                            console.log(err);
                        }
                    });
            });

            
            //get admin messages list
            socket.on(`getMessages-${token}`, function (data) {
                messageController
                    .getMessages(token, data.page, data.chat_title_id)
                    .then(function (res) {
                        try {
                            socket.emit(`sendMessages-${token}`, res);
                        } catch (err) {
                            console.log(err);
                        }
                    });
            });

            socket.on(`sendImage-${token}`, function (data) {
                var fileName = __dirname + '/../../uploads/' + _.random(1000000000, 9999999999) + '_' + data.imageName;
                data.fileName = fileName
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
                messageController.setMessage(data, token).then(function (result) {
                    console.log(result)
                    try {
                        let userToken = result.to;
                        self.emit(`getMessage-${userToken}`, {
                            id: result._id,
                            text: result.message,
                            createdAt: Utility.getPersianTime(result.createdAt),
                            type: result.type,
                            messageStatus: 1,
                            seen: result.seen,
                            file: result.file,
                            date: Utility.getPersianDate(result.createdAt)
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
                if (typeof data === "undefined") {
                    self.emit(`typing-admin`, {
                        typing: null
                    });
                } else {
                    console.log(data)
                    self.emit(`typing-${data.token}`);
                }
            });

            socket.on("disconnect", async () => {
                //userController.onlineStatus(token, constants.user.onlineStatus.offline)
            });
        });
    }
}

export default Socket;