const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: {
        type: String, // Email or name of the sender
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const ChatSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project', // Assuming you have a Project model
        required: true,
        unique: true, // One chat per project
    },
    messages: [MessageSchema],
});

module.exports = mongoose.model('Chat', ChatSchema);
