const Organization = require('../models/organizationModel');
const User = require('../models/userModel');
const crypto = require('crypto');

exports.getUserOrganizations = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        const organizations = await Organization.find({ members: email });
        res.status(200).json({ organizations });
    } catch (error) {
        console.error('Error fetching user organizations:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.handleOrganization = async (req, res) => {
    try {
        const { name, inviteCode, email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'User email is required.' });
        }

        // Ensure that the email exists in the User collection
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (name && !inviteCode) {
            // **Create Organization**

            // Generate a unique invite code
            let generatedInviteCode;
            let isUnique = false;

            while (!isUnique) {
                generatedInviteCode = crypto.randomBytes(6).toString('hex');
                const existingOrg = await Organization.findOne({ inviteCode: generatedInviteCode });
                if (!existingOrg) {
                    isUnique = true;
                }
            }

            // Create the organization
            const organization = new Organization({
                name,
                inviteCode: generatedInviteCode,
                createdBy: email, // Use email instead of user ID
                members: [email], // Add the creator's email as the first member
            });

            await organization.save();

            // Optionally, update the user's organizations list
            // await User.findOneAndUpdate({ email }, { $push: { organizations: organization._id } });

            res.status(201).json({
                message: 'Organization created successfully.',
                organization,
            });
        } else if (inviteCode && !name) {
            // **Join Organization**

            // Find the organization with the invite code
            const organization = await Organization.findOne({ inviteCode });

            if (!organization) {
                return res.status(404).json({ message: 'Invalid invite code.' });
            }

            // Check if the user is already a member
            if (organization.members.includes(email)) {
                return res.status(400).json({ message: 'You are already a member of this organization.' });
            }

            // Add the user to the organization's members
            organization.members.push(email);
            await organization.save();

            // Optionally, update the user's organizations list
            // await User.findOneAndUpdate({ email }, { $push: { organizations: organization._id } });

            res.status(200).json({
                message: 'Joined organization successfully.',
                organization,
            });
        } else {
            return res.status(400).json({
                message:
                    'Invalid request. Provide either an organization name to create a new organization or an invite code to join an existing organization.',
            });
        }
    } catch (error) {
        console.error('Error handling organization:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};
