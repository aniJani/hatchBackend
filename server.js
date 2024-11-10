const { generateDivTasks } = require('./OpenAI/controllers/openaiController.js');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const projectRoutes = require('./routes/projectRoutes');
const invitationRoutes = require('./routes/invitationRoutes'); // Import invitation routes

const app = express();

app.use(cors());
app.use(express.json());

// Placeholder route for testing
app.get('/', (req, res) => res.send('Server is running!'));

// Connect to MongoDB with simplified syntax
const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

// OpenAI Task Generation Route
app.post('/openai/TaskGen', generateDivTasks);

// User Routes
app.use('/user', userRoutes); // Use user routes with the '/user' path prefix

// Project Routes
app.use('/projects', projectRoutes);
app.use('/invites', invitationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
