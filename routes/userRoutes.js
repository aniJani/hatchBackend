const express = require('express');
const { createUser } = require('../controllers/userCreation'); // Adjust the path if necessary
const { matchUsers } = require('../controllers/matchUser');
const { getUserByEmail } = require('../controllers/getUsers');
const router = express.Router();

// Route to create a new user
router.post('/register', createUser);
router.post('/match', matchUsers)
router.get('/getUserByEmail', getUserByEmail);

module.exports = router;