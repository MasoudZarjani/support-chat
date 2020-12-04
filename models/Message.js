import mongoose from 'mongoose'
import timestamps from 'mongoose-timestamp'
import mongoosePaginate from 'mongoose-paginate-v2'

const MessageSchema = new mongoose.Schema({
    title: {
        type: String
    },
    message: {
        type: String,
        default: '',
    },
    from: {
        type: String,
    },
    to: {
        type: String,
    },
    token: {
        type: String,
    },
    file: {
        path: {
            type: String,
            default: '',
        },
        mime: {
            type: String,
            default: '',
        },
        size: {
            type: Number,
            default: 0,
        },
    },
    type: {
        type: Number,
        default: 0,
    },
    seen: {
        type: Number,
        default: 0,
    },
})

MessageSchema.plugin(timestamps);
MessageSchema.plugin(mongoosePaginate);

export default mongoose.model('Message', MessageSchema)