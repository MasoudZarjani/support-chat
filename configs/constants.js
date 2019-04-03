export default {
    message: {
        sender: 0,
        receiver: 1,
        type: {
            text: 0,
            image: 1,
            video: 2,
            sound: 3,
            special:4 // for welcome message and date change
        }
    },
    user: {
        onlineStatus: {
            offline: 0,
            online: 1
        }
    }
}