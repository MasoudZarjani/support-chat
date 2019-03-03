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
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
})

MessageSchema.plugin(timestamps);

export default mongoose.model('Message', MessageSchema)