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

/**
 * Function to fetch a project by its project ID.
 * @param {Object} req - The request object containing projectId in the parameters.
 * @param {Object} res - The response object.
 */
const getProjectById = async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    return res.status(400).json({ error: 'Project ID is required' });
  }

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};
/**
 * Function to edit a project by its project ID, excluding the ability to change the owner role.
 * @param {Object} req - The request object containing projectId in the parameters and updated fields in the body.
 * @param {Object} res - The response object.
 */
const editProject = async (req, res) => {
  const { projectId } = req.params;
  const { projectName, description, collaboratorEmails, goals } = req.body;

  if (!projectId) {
    return res.status(400).json({ error: 'Project ID is required' });
  }

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update project name and description if provided
    if (projectName) project.projectName = projectName;
    if (description) project.description = description;

    // Update collaborators, excluding changes to the owner
    if (collaboratorEmails) {
      const updatedCollaborators = [
        ...project.collaborators.filter(collab => collab.role === 'owner'), // Retain the owner as is
        ...collaboratorEmails.map(email => ({ email, role: 'collaborator' })) // Add or update other collaborators
      ];
      project.collaborators = updatedCollaborators;
    }

    // Update goals if provided, with validation
    if (goals) {
      const validatedGoals = goals.map(goal => {
        // Ensure 'assignedTo' is a valid collaborator
        if (goal.assignedTo && !project.collaborators.some(collab => collab.email === goal.assignedTo)) {
          throw new Error(`Assigned email ${goal.assignedTo} is not a collaborator on this project.`);
        }
        return {
          ...goal,
          estimatedTime: goal.estimatedTime || '',
        };
      });
      project.goals = validatedGoals;
    }

    await project.save();
    res.status(200).json({ message: 'Project updated successfully', project });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: error.message || 'Failed to update project' });
  }
};

module.exports = { getProjects, createProject, fetchProjectsByUser, getProjectById, editProject };
