const mongoose = require('mongoose');
const { Schema } = mongoose;

const invitationSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    inviterEmail: {
        type: String,
        required: true
    },
    inviteeEmail: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Invitation', invitationSchema);
