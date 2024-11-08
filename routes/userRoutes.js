const express = require('express');
const { createUser } = require('../controllers/userCreation'); // Adjust the path if necessary
const { matchUsers } = require('../controllers/matchUser');
const router = express.Router();

// Route to create a new user
router.post('/register', createUser);
router.post('/match', matchUsers)
module.exports = router;