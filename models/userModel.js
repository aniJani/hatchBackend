const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    descriptionEmbedding: {
        type: [Number], // Array of numbers representing the embedding vector
        default: []
    },
    skills: {
        type: [String],
        default: []
    },
    skillsEmbedding: {
        type: [Number], // Embedding vector for the skills field
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
