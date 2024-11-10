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
        type: [Number],
        default: []
    },
    skills: {
        type: [String],
        default: []
    },
    skillsEmbedding: {
        type: [Number],
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
    }],
    expoPushToken: {
        type: String, // Field to store the Expo Push Token
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
