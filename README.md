# HatchBackend
The frontend repository for this application can be found at: https://github.com/aniJani/hatchmobile.
HatchBackend is the server-side component of the HatchMobile application, providing API endpoints for project management, user authentication, collaboration tools, and AI-powered features. Built with Node.js, Express, and MongoDB, it handles data management and business logic for the mobile application.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [OpenAI Integration](#openai-integration)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Management:** Registration, profile management, and skill-based matchmaking
- **Project Management:** Create, retrieve, and update projects with collaborator roles
- **Invitation System:** Send and manage invitations to potential collaborators
- **Organization Management:** Create and join organizations with invite codes
- **Real-time Chat:** Project-specific chat functionality with AI assistant integration
- **AI-Powered Features:**
  - Task division generation
  - User matchmaking based on skills and project requirements
  - AI-assisted chat responses

## Tech Stack

- **Node.js & Express:** RESTful API framework
- **MongoDB & Mongoose:** Database and object modeling
- **OpenAI API:** For embeddings and AI-assisted features
- **Axios:** HTTP client for external API requests
- **Dotenv:** Environment variable management
- **CORS:** Cross-Origin Resource Sharing support

## Directory Structure

```
anijani-hatchbackend/
├── package.json          # Project dependencies and scripts
├── server.js             # Entry point and server setup
├── controllers/          # Request handlers
│   ├── invitationController.js
│   ├── organizationController.js
│   ├── projectController.js
│   └── User/
│       ├── getUsers.js
│       ├── matchUser.js
│       ├── updateUser.js
│       └── userCreation.js
├── models/               # Database schemas
│   ├── chatModel.js
│   ├── invitationModel.js
│   ├── organizationModel.js
│   ├── projectModel.js
│   ├── taskModel.js
│   └── userModel.js
├── OpenAI/               # OpenAI integration
│   ├── config/
│   │   └── openaiconfig.js
│   └── controllers/
│       └── openaiController.js
└── routes/               # API route definitions
    ├── chatRoutes.js
    ├── invitationRoutes.js
    ├── organizationRoutes.js
    ├── projectRoutes.js
    └── userRoutes.js
```

## Installation

Before running the application, please ensure you have installed [Node.js](https://nodejs.org/) (version 14.x or higher) and [MongoDB](https://www.mongodb.com/try/download/community).

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/anijani-hatchbackend.git
   cd anijani-hatchbackend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the project root with the following environment variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hatchmobile
OPEN_AI_KEY=your_openai_api_key
OPENAI_API_KEY=your_openai_api_key
```

Make sure to replace the placeholder values with your actual configuration.

## API Endpoints

### User Routes

- **POST /user/register**: Create a new user
- **PUT /user/update**: Update user profile (description, skills, collaboration status)
- **GET /user/getUserByEmail**: Get user details by email
- **POST /user/match**: Match users based on skills and description
- **POST /user/match-collaborators**: Match project collaborators

### Project Routes

- **GET /projects/list**: Get projects by user email
- **POST /projects/create**: Create a new project
- **GET /projects/:projectId**: Get project details
- **PUT /projects/:projectId/edit**: Update project details

### Invitation Routes

- **POST /invites/invite**: Send an invitation to a collaborator
- **GET /invites/invitee**: Get invitations for an invitee
- **GET /invites/inviter**: Get invitations for an inviter
- **PUT /invites/:invitationId/status**: Update invitation status

### Organization Routes

- **POST /organizations**: Create or join an organization
- **GET /organizations/user**: Get organizations for a user
- **GET /organizations/:organizationId**: Get organization details

### Chat Routes

- **POST /chat/:projectId**: Add a message to project chat
- **GET /chat/:projectId**: Get messages for a project

### OpenAI Routes

- **POST /openai/TaskGen**: Generate task divisions for a project

## Database Models

### User Model

Stores user information including name, email, skills, and collaboration preferences. Includes embedding vectors for semantic search.

### Project Model

Defines project structure with name, description, collaborators, and goals. Collaborators have roles (owner/collaborator).

### Invitation Model

Tracks invitations between users for project collaboration with status tracking.

### Organization Model

Represents user organizations with members and invite codes for joining.

### Chat Model

Stores project-specific chat messages with sender information and timestamps.

### Task Model

Detailed task information with assignment and status tracking.

## OpenAI Integration

The backend integrates with OpenAI's API for three main features:

1. **Text Embeddings**: Converts user descriptions and skills into vector embeddings for semantic matching
2. **Task Division**: Generates detailed project task breakdowns with estimated completion times
3. **AI Chat Assistant**: Provides AI-assisted responses in project chats

## Available Scripts

In the project directory, you can run:

```bash
# Start the server
npm start

```

## Contributing

Contributions are welcome! Please fork the repository, create a branch for your feature or bug fix, and submit a pull request.

## License

This project is licensed under the MIT License.
