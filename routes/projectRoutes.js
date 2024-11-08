// routes/projectRoutes.js
const express = require('express');
const { getProjects, getProjectsByUserId } = require('../controllers/projectController'); // Import the controller

const router = express.Router();

// Existing route for listing all projects
router.get('/list', getProjects);

// New route to fetch projects by userId
router.get('/user/:userId', getProjectsByUserId);

module.exports = router;
