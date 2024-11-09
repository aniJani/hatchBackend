const express = require('express');
const { createUser } = require('../controllers/User/userCreation'); // Adjust the path if necessary
const { matchUsers, matchProjectCollaborators } = require('../controllers/User/matchUser');
const { updateUser } = require('../controllers/User/updateUser');
const { getUserByEmail } = require('../controllers/User/getUsers');
const router = express.Router();

// Route to create a new user
router.post('/register', createUser);
router.post('/match', matchUsers)
router.post('/match-collaborators', matchProjectCollaborators)
router.get('/getUserByEmail', getUserByEmail);
router.put('/update', updateUser)

module.exports = router;