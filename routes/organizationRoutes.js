// routes/organizationRoutes.js
const express = require('express');
const { handleOrganization, getUserOrganizations } = require('../controllers/organizationController');
const router = express.Router();

router.post('/', handleOrganization);
router.get('/user', getUserOrganizations)

module.exports = router;
