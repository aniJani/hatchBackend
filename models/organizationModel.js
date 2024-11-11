const mongoose = require('mongoose');
const { Schema } = mongoose;

const organizationSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        members: [
            {
                type: String, // Using email strings
            },
        ],
        inviteCode: {
            type: String,
            required: true,
            unique: true,
        },
        createdBy: {
            type: String, // Using email string
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Organization', organizationSchema);
