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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    token: {
        type: String,
    },
    type: {
        type: Number,
    },
})

MessageSchema.plugin(timestamps);

export default mongoose.model('Message', MessageSchema)