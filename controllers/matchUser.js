const mongoose = require('mongoose');
const User = require('../models/userModel');
const { getEmbedding } = require('../OpenAI/controllers/openaiController'); // Update this path as necessary

// Function to calculate cosine similarity between two vectors
function cosineSimilarity(vec1, vec2) {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    return dotProduct; // Vectors are assumed to be normalized
}

// Normalize a vector
function normalizeVector(vector) {
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return vector.map(val => val / magnitude);
}

// Function to match users based on a query
const matchUsers = async (req, res) => {
    try {
        const { query } = req.body;

        if (!query || typeof query !== 'string') {
            return res.status(400).json({ error: 'Invalid query' });
        }

        // Generate embeddings for the query
        const queryEmbedding = await getEmbedding(query);
        const normalizedQueryEmbedding = normalizeVector(queryEmbedding);

        // Find users who are open to collaboration
        const users = await User.find({ openToCollaboration: true });

        // Calculate similarity for each user based on skills and description embeddings
        const userSimilarities = users.map(user => {
            const combinedEmbedding = [
                ...user.descriptionEmbedding,
                ...user.skillsEmbedding
            ];
            const normalizedUserEmbedding = normalizeVector(combinedEmbedding);
            const similarity = cosineSimilarity(normalizedQueryEmbedding, normalizedUserEmbedding);

            return { user, similarity };
        });

        // Sort users by similarity in descending order and get the top 5
        const topMatches = userSimilarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 5)
            .map(entry => {
                const { descriptionEmbedding, skillsEmbedding, ...userWithoutEmbeddings } = entry.user.toObject();
                return userWithoutEmbeddings;
            });

        res.status(200).json(topMatches);
    } catch (error) {
        console.error('Error matching users:', error.message);
        res.status(500).json({ error: 'Error matching users' });
    }
};

module.exports = { matchUsers };
