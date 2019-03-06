import mongoose from 'mongoose'
import timestamps from 'mongoose-timestamp'

const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    family: {
        type: String
    },
    token: {
        type: String
    },
    avatar: {
        type: String
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }]
})

UserSchema.plugin(timestamps);

export default mongoose.model('User', UserSchema)