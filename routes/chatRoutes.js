// routes/chatRoutes.js

const express = require('express');
const router = express.Router();
const Chat = require('../models/chatModel')

// GET messages for a specific project
router.get('/:projectId', async (req, res) => {
    const { projectId } = req.params;
    try {
        let chat = await Chat.findOne({ projectId });
        if (!chat) {
            // If no chat exists for the project, create one
            chat = new Chat({ projectId, messages: [] });
            await chat.save();
        }
        res.json(chat.messages);
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

        res.status(201).json(chat.messages);
    } catch (error) {
        console.error('Error sending chat message:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
