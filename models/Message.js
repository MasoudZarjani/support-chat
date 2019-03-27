import mongoose from 'mongoose'
import timestamps from 'mongoose-timestamp'
import mongoosePaginate from 'mongoose-paginate-v2'

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
    chat_title_id: {
        type: Number,
    },
    token: {
        type: String,
    },
    type: {
        type: Number,
    },
    seen: {
        type: Number,
    },
})

MessageSchema.plugin(timestamps);
MessageSchema.plugin(mongoosePaginate);

export default mongoose.model('Message', MessageSchema)