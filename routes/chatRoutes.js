// routes/chatRoutes.js

const express = require('express');
const router = express.Router();
const Chat = require('../models/chatModel');
const Project = require('../models/projectModel');
const User = require('../models/userModel');
const { generateAIReply } = require('../OpenAI/controllers/openaiController'); // Adjust path if necessary

// POST a new message to a project's chat
router.post('/:projectId', async (req, res) => {
    const { projectId } = req.params;
    const { sender, content } = req.body;

    if (!sender || !content) {
        return res.status(400).json({ message: 'Sender and content are required' });
    }

    try {
        let chat = await Chat.findOne({ projectId });
        if (!chat) {
            // If no chat exists for the project, create one
            chat = new Chat({ projectId, messages: [] });
        }

        // Append the user's message
        const userMessage = { sender, content, timestamp: new Date() };
        chat.messages.push(userMessage);

        // Check if the message starts with @chatAI
        if (content.trim().startsWith('@chatAI')) {
            // Extract the actual message after @chatAI
            const userCommand = content.trim().substring(7).trim();

            // Fetch project details
            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            // Fetch collaborators associated with the project
            const collaboratorsInProject = project.collaborators; // Array of {email, role}

            // Fetch user details for each collaborator to get their skills
            const collaboratorsWithSkills = await Promise.all(collaboratorsInProject.map(async (collab) => {
                const user = await User.findOne({ email: collab.email });
                if (user) {
                    return {
                        name: user.name,
                        email: user.email,
                        skills: user.skills
                    };
                } else {
                    return {
                        name: 'Unknown',
                        email: collab.email,
                        skills: []
                    };
                }
            }));

            // Compile project info and goals
            const projectInfo = project.description; // Adjust based on your schema
            const goals = project.goals.map(goal => goal.title); // Adjust based on your schema

            // Generate AI reply
            const aiReplyContent = await generateAIReply({
                collaborators: collaboratorsWithSkills,
                projectInfo,
                goals,
                userMessage: userCommand,
            });

            // Append AI message
            const aiMessage = { sender: 'AI', content: aiReplyContent, timestamp: new Date() };
            chat.messages.push(aiMessage);
        }

        await chat.save();

        res.status(201).json(chat.messages);
    } catch (error) {
        console.error('Error in POST /chat/:projectId:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET messages for a specific project with optional limit
router.get('/:projectId', async (req, res) => {
    const { projectId } = req.params;
    const limit = parseInt(req.query.limit) || 50; // Default to 50 messages

    try {
        let chat = await Chat.findOne({ projectId });
        if (!chat) {
            // If no chat exists for the project, create one
            chat = new Chat({ projectId, messages: [] });
            await chat.save();
        }

        // Return the latest 'limit' messages
        const latestMessages = chat.messages
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit)
            .reverse(); // Reverse to maintain chronological order

        res.json(latestMessages);
    } catch (error) {
        console.error('Error in GET /chat/:projectId:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
