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
            type: String, // Email of the collaborator
            required: true
        },
        role: {
            type: String,
            enum: ['owner', 'collaborator'], // Role can be 'owner' or 'collaborator'
            required: true
        }
    }],
    goals: [{
        goalId: {
            type: Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId() // Corrected: generate a unique goal ID
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
            validate: {
                validator: function (email) {
                    // Validate that assignedTo is in the list of collaborators' emails
                    return this.collaborators.some(collaborator => collaborator.email === email);
                },
                message: 'Assigned email must be a collaborator on this project'
            }
        }
    }]
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

module.exports = mongoose.model('Project', projectSchema);
