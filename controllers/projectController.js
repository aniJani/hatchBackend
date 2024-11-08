// controllers/projectController.js
const Project = require('../models/projectModel'); // Import the Project model

// Controller to get the list of projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find(); // Fetch all projects from the database
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};



module.exports = { getProjects };

