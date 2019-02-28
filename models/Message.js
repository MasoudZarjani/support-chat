import mongoose from 'mongoose'
import timestamps from 'mongoose-timestamp'

const MessageSchema = new mongoose.Schema({
    title: {
        type: String
    },
    message: {
        type: String
    },
    from: {
        type: String
    },
    to: {
        type: String
    }
})

MessageSchema.plugin(timestamps);

export default mongoose.model('Message', MessageSchema)
