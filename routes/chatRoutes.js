// routes/chatRoutes.js

const express = require('express');
const router = express.Router();
const Chat = require('../models/chatModel');

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
        console.error('Error fetching chat messages:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

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

        // Append the new message
        chat.messages.push({ sender, content });
        await chat.save();

        // Fetch the latest 'limit' messages to return
        const limit = 50;
        const latestMessages = chat.messages
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit)
            .reverse();

        res.status(201).json(latestMessages);
    } catch (error) {
        console.error('Error sending chat message:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
