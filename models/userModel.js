const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ''
    },
    skills: {
        type: [String],
        default: []
    },
    openToCollaboration: {
        type: Boolean,
        default: true
    },
    projectsOwned: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }],
    collaborations: [{
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'Project'
        },
        role: {
            type: String,
            default: 'collaborator'
        }
    }]
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

module.exports = mongoose.model('User', userSchema);
