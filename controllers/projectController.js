const Project = require('../models/projectModel'); // Import the Project model

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find(); // Fetch all projects from the database
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

const createProject = async (req, res) => {
  const { projectName, description, ownerEmail, collaboratorEmails, goals } = req.body;

  if (!projectName || !ownerEmail) {
    return res.status(400).json({ error: 'Project name and owner email are required' });
  }

  try {
    // Create the collaborators array, adding the owner as the first collaborator with role "owner"
    const collaborators = [
      { email: ownerEmail, role: 'owner' },
      ...(Array.isArray(collaboratorEmails) ? collaboratorEmails.map(email => ({ email, role: 'collaborator' })) : [])
    ];

    // Validate and filter goals
    const validatedGoals = goals.map(goal => {
      // Check if assignedTo email exists in collaborators
      if (goal.assignedTo && !collaborators.some(collab => collab.email === goal.assignedTo)) {
        throw new Error(`Assigned email ${goal.assignedTo} is not a collaborator on this project.`);
      }
      return {
        ...goal,
        estimatedTime: goal.estimatedTime || '',
      };
    });

    // Create a new project document
    const newProject = new Project({
      projectName,
      description,
      collaborators,
      goals: validatedGoals
    });

    await newProject.save();
    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: error.message || 'Failed to create project' });
  }
};


module.exports = { getProjects, createProject };
