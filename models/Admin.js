import mongoose from 'mongoose'
import timestamps from 'mongoose-timestamp'

const AdminSchema = new mongoose.Schema({
    name: {
        type: String
    },
    family: {
        type: String
    },
    token: {
        type: String
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }]
})

AdminSchema.plugin(timestamps);

export default mongoose.model('Admin', AdminSchema)