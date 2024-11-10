const User = require('../../models/userModel'); // Adjust the path as necessary
const { getEmbedding } = require('../../OpenAI/controllers/openaiController'); // Import getEmbedding from OpenAIcontroller

// Function to create a new user in MongoDB
const createUser = async (req, res) => {
    const { email, name, description, skills, openToCollaboration, expoPushToken } = req.body;

    // Check if all required fields are provided
    if (!email || !name) {
        return res.status(400).json({ error: 'Email and name are required' });
    }

    try {
        // Check if the user already exists in MongoDB
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Prepare text inputs for embeddings
        const descriptionText = description || '';
        const skillsText = Array.isArray(skills) ? skills.join(', ') : '';

        // Generate embeddings concurrently using the imported getEmbedding function
        const [descriptionEmbedding, skillsEmbedding] = await Promise.all([
            getEmbedding(descriptionText),
            getEmbedding(skillsText),
        ]);

        // Create a new user document
        const newUser = new User({
            email,
            name,
            description,
            descriptionEmbedding,
            skills: Array.isArray(skills) ? skills : [],
            skillsEmbedding,
            openToCollaboration: openToCollaboration ?? true, // Default to true if not provided
            expoPushToken, // Save the Expo Push Token if provided
        });

        // Log the data being saved
        console.log('Saving new user to the database:', {
            email: newUser.email,
            name: newUser.name,
            description: newUser.description,
            skills: newUser.skills,
            openToCollaboration: newUser.openToCollaboration,
            descriptionEmbedding: newUser.descriptionEmbedding,
            skillsEmbedding: newUser.skillsEmbedding,
            expoPushToken: newUser.expoPushToken,
        });

        // Save the user in MongoDB
        await newUser.save();

        // Log confirmation after saving
        console.log('User saved successfully:', {
            id: newUser._id,
            email: newUser.email,
            name: newUser.name,
        });

        res
            .status(201)
            .json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

module.exports = { createUser };
