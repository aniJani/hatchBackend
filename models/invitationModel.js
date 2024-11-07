const mongoose = require('mongoose');
const { Schema } = mongoose;

const invitationSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    inviterId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    inviteeId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
