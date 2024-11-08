const express = require('express');
const { createUser } = require('../controllers/User/userCreation'); // Adjust the path if necessary
const { matchUsers } = require('../controllers/User/matchUser');
const { getUserByEmail } = require('../controllers/User/getUsers');
const router = express.Router();

// Route to create a new user
router.post('/register', createUser);
router.post('/match', matchUsers)
router.get('/getUserByEmail', getUserByEmail);

module.exports = router;