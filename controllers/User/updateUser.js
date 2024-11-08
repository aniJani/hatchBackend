const User = require('../../models/userModel'); // Adjust the path as necessary
const { getEmbedding } = require('../../OpenAI/controllers/openaiController'); // Import getEmbedding from OpenAIcontroller

/**
 * Function to update a user's description, skills, and openToCollaboration in MongoDB
 * @param {Object} req - The request object, containing email, description, skills, and openToCollaboration in the body.
 * @param {Object} res - The response object.
 */
const updateUser = async (req, res) => {
    const { email, description, skills, openToCollaboration } = req.body;

    // Check if the email is provided
    if (!email) {
        return res.status(400).json({ error: 'Email is required to update user' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Prepare text inputs for new embeddings
        const descriptionText = description || user.description;
        const skillsText = Array.isArray(skills) ? skills.join(', ') : user.skills.join(', ');

        // Generate embeddings for the updated description and skills
        const [descriptionEmbedding, skillsEmbedding] = await Promise.all([
            getEmbedding(descriptionText),
            getEmbedding(skillsText),
        ]);

        // Update user fields
        user.description = description || user.description;
        user.skills = Array.isArray(skills) ? skills : user.skills;
        user.descriptionEmbedding = descriptionEmbedding;
        user.skillsEmbedding = skillsEmbedding;

        // Update openToCollaboration if provided
        if (typeof openToCollaboration === 'boolean') {
            user.openToCollaboration = openToCollaboration;
        }

        // Log the updated data
        console.log('Updating user in the database:', {
            email: user.email,
            newDescription: user.description,
            newSkills: user.skills,
            newDescriptionEmbedding: user.descriptionEmbedding,
            newSkillsEmbedding: user.skillsEmbedding,
            openToCollaboration: user.openToCollaboration,
        });

        // Save the updated user in MongoDB
        await user.save();

        // Log confirmation after saving
        console.log('User updated successfully:', {
            id: user._id,
            email: user.email,
            newDescription: user.description,
            newSkills: user.skills,
            openToCollaboration: user.openToCollaboration,
        });

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

module.exports = { updateUser };
