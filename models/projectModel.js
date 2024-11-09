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
    collaborators: [{
        email: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['owner', 'collaborator'],
            required: true
        }
    }],
    goals: [{
        goalId: {
            type: Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId()
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
        },
        assignedTo: {
            type: String, // Email of the collaborator assigned to this goal
        },
        estimatedTime: {
            type: String,
            default: ''
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
