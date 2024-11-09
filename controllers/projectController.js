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

/**
 * Function to create and save a new project in MongoDB
 * @param {Object} req - The request object, containing project details in the body.
 * @param {Object} res - The response object.
 */
const createProject = async (req, res) => {
  const { projectName, description, ownerEmail, collaboratorEmails, goals } = req.body;

  // Check if required fields are provided
  if (!projectName || !ownerEmail) {
    return res.status(400).json({ error: 'Project name and owner email are required' });
  }

  try {
    // Create the collaborators array, adding the owner as the first collaborator with role "owner"
    const collaborators = [
      { email: ownerEmail, role: 'owner' }, // Owner is added as a collaborator with role "owner"
      ...(Array.isArray(collaboratorEmails) ? collaboratorEmails.map(email => ({
        email,
        role: 'collaborator'
      })) : [])
    ];

    // Validate that assigned emails in goals are in the list of collaborators
    const validatedGoals = Array.isArray(goals) ? goals.map(goal => {
      if (goal.assignedTo && !collaborators.some(collab => collab.email === goal.assignedTo)) {
        throw new Error(`Assigned email ${goal.assignedTo} is not a collaborator on this project.`);
      }
      return goal;
    }) : [];

    // Create a new project document
    const newProject = new Project({
      projectName,
      description,
      collaborators,
      goals: validatedGoals
    });

    // Save the project to the database
    await newProject.save();

    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: error.message || 'Failed to create project' });
  }
};

const User = require('../models/userModel'); // Adjust the path as needed

/**
 * Function to fetch projects by user ID, with optional filtering by role.
 * @param {Object} req - The request object containing userId and optional role.
 * @param {Object} res - The response object.
 */
const fetchProjectsByUser = async (req, res) => {
  const { email, role } = req.query; // Assuming email and role are passed as query parameters

  if (!email) {
      return res.status(400).json({ error: 'Email is required' });
  }

  try {
      // Find projects where the given email is an owner or a collaborator
      const projects = await Project.find({
          $or: [
              { 'collaborators.email': email }, // Check if the user is a collaborator
              { 'ownerEmail': email }           // Check if the user is the project owner (if applicable)
          ]
      });

      // Filter projects by role if the role is provided
      let filteredProjects = projects;
      if (role) {
          filteredProjects = projects.filter(project =>
              project.collaborators.some(collab => collab.email === email && collab.role === role)
          );
      }

      res.status(200).json({ projects: filteredProjects });
  } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
  }
};
module.exports = { getProjects, createProject,  fetchProjectsByUser };

