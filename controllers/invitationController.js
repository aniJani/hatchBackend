const Invitation = require('../models/invitationModel'); // Import the Invitation model

/**
 * Function to send an invitation to a potential collaborator.
 * @param {Object} req - The request object containing projectId, inviterEmail, and inviteeEmail in the body.
 * @param {Object} res - The response object.
 */
const sendInvitation = async (req, res) => {
    const { projectId, inviterEmail, inviteeEmail } = req.body;

    if (!projectId || !inviterEmail || !inviteeEmail) {
        return res.status(400).json({ error: 'Project ID, inviter email, and invitee email are required' });
    }

    try {
        // Check if an invitation already exists with 'pending' status
        const existingInvitation = await Invitation.findOne({ projectId, inviterEmail, inviteeEmail, status: 'pending' });
        if (existingInvitation) {
            return res.status(400).json({ message: 'Invitation already sent.' });
        }

        // Create a new invitation if it does not exist
        const newInvitation = new Invitation({ projectId, inviterEmail, inviteeEmail });
        await newInvitation.save();
        res.status(201).json({ message: 'Invitation sent successfully.', invitation: newInvitation });
    } catch (error) {
        console.error('Error sending invitation:', error);
        res.status(500).json({ error: 'Failed to send invitation.' });
    }
};

/**
 * Function to fetch invitations by invitee email.
 * @param {Object} req - The request object containing inviteeEmail in the query parameters.
 * @param {Object} res - The response object.
 */
const getInvitationsForInvitee = async (req, res) => {
    const { inviteeEmail } = req.query;

    if (!inviteeEmail) {
        return res.status(400).json({ error: 'Invitee email is required' });
    }

    try {
        const invitations = await Invitation.find({ inviteeEmail }).populate('projectId', 'projectName');
        res.status(200).json(invitations);
    } catch (error) {
        console.error('Error fetching invitations for invitee:', error);
        res.status(500).json({ error: 'Failed to fetch invitations for invitee' });
    }
};

/**
 * Function to fetch invitations by inviter email.
 * @param {Object} req - The request object containing inviterEmail in the query parameters.
 * @param {Object} res - The response object.
 */
const getInvitationsForInviter = async (req, res) => {
    const { inviterEmail } = req.query;

    if (!inviterEmail) {
        return res.status(400).json({ error: 'Inviter email is required' });
    }

    try {
        const invitations = await Invitation.find({ inviterEmail }).populate('projectId', 'projectName');
        res.status(200).json(invitations);
    } catch (error) {
        console.error('Error fetching invitations for inviter:', error);
        res.status(500).json({ error: 'Failed to fetch invitations for inviter' });
    }
};

const updateInvitationStatus = async (req, res) => {
    const { invitationId } = req.params;
    const { status } = req.body;

    if (!['accepted', 'declined'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const invitation = await Invitation.findByIdAndUpdate(
            invitationId,
            { status },
            { new: true }
        );

        if (!invitation) {
            return res.status(404).json({ error: 'Invitation not found' });
        }

        res.status(200).json({ message: 'Invitation status updated', invitation });
    } catch (error) {
        console.error('Error updating invitation status:', error);
        res.status(500).json({ error: 'Failed to update invitation status' });
    }
};

module.exports = { sendInvitation, getInvitationsForInvitee, getInvitationsForInviter, updateInvitationStatus };
