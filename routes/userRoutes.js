const express = require('express');
const { createUser } = require('../controllers/userCreation'); // Adjust the path if necessary
const router = express.Router();

// Route to create a new user
router.post('/register', createUser);

module.exports = router;