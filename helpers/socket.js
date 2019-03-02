import { mongodb } from '../configs/db'
class Socket {
    constructor(socket) {
        this.io = socket;
        mongodb();
    }

    socketEvents() {
        this.io.on('connection', (socket) => {
            console.log(socket.id);
            socket.on('sendMessage', function (data) {
                console.log(data)
                socket.emit('message', data);
            });
            
            socket.on('disconnect', async () => {
                socket.emit('chatListRes', {
                    userDisconnected: true,
                    socket_id: socket.id
                });
            });
        })
    }
}

export default Socket;