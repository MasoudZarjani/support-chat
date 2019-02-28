class Socket {
    constructor(socket) {
        this.io = socket;
        console.log(this.io)
    }

    socketEvents() {
        this.io.on('connection', (socket) => {
            console.log('users')

        })
    }
}

export default Socket;