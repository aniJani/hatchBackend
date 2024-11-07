// server.js
require('dotenv').config(); // Add this line at the very top
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Placeholder route for testing
app.get('/', (req, res) => res.send('Server is running!'));

// Connect to MongoDB with simplified syntax
const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
