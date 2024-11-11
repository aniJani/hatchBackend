// routes/organizationRoutes.js
const express = require('express');
const { handleOrganization, getUserOrganizations, getOrganizationById } = require('../controllers/organizationController');
const router = express.Router();

router.post('/', handleOrganization);
router.get('/user', getUserOrganizations)
router.get('/:organizationId', getOrganizationById);

module.exports = router;
