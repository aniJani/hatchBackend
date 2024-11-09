// routes/projectRoutes.js
const express = require('express');
const { fetchProjectsByUser, createProject } = require('../controllers/projectController'); // Import the controller

const router = express.Router();

// Existing route for listing all projects
router.get('/list', fetchProjectsByUser);
router.post('/create', createProject);


// // New route to fetch projects by userId
// router.get('/user/:userId', getProjectsByUserId);

module.exports = router;
