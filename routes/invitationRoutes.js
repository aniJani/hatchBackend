const express = require('express');
const router = express.Router();
const { sendInvitation, getInvitationsForInvitee, getInvitationsForInviter, updateInvitationStatus } = require('../controllers/invitationController');

// Endpoint to create an invitation
router.post('/invite', sendInvitation);

router.put('/:invitationId/status', updateInvitationStatus);
// Endpoint to fetch invitations by invitee email
router.get('/invitee', getInvitationsForInvitee);

// Endpoint to fetch invitations by inviter email
router.get('/inviter', getInvitationsForInviter);

module.exports = router;
