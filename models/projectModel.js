const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
    projectName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    collaborators: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            default: 'collaborator'
        }
    }],
    goals: [{
        goalId: {
            type: Schema.Types.ObjectId,
            default: mongoose.Types.ObjectId // Generate a unique goal ID
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ''
        },
        status: {
            type: String,
            enum: ['not started', 'in progress', 'completed'],
            default: 'not started'
        }
    }]
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

module.exports = mongoose.model('Project', projectSchema);
