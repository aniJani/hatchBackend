const User = require('../models/userModel'); // Adjust the path to your User model if necessary

/**
 * Finds a user by their email and returns their details without embeddings.
 * @param {Object} req - The request object, containing the email in the query parameters.
 * @param {Object} res - The response object.
 */
const getUserByEmail = async (req, res) => {
    const { email } = req.query;

    try {
        // Validate that an email was provided
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Search for the user in the database by email, excluding embedding fields
        const user = await User.findOne({ email }).select('-descriptionEmbedding -skillsEmbedding');

        // Check if the user was found
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with the user data if found, excluding embedding fields
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by email:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    getUserByEmail,
};
