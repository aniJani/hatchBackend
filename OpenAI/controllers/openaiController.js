const openai = require('../config/openaiconfig');
const axios = require('axios');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const getEmbedding = async (text) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/embeddings',
            {
                input: text,
                model: 'text-embedding-ada-002',
                encoding_format: 'float' // Ensure this parameter is supported by the API
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (
            response.data &&
            Array.isArray(response.data.data) &&
            response.data.data.length > 0 &&
            Array.isArray(response.data.data[0].embedding)
        ) {
            const embedding = response.data.data[0].embedding;
            return embedding;
        } else {
            throw new Error('Unexpected response structure from OpenAI API');
        }
    } catch (error) {
        // Enhanced error handling
        if (error.response) {
            // The request was made, and the server responded with a status code outside of the 2xx range
            console.error('Error response from OpenAI API:', error.response.data);
            throw new Error(`OpenAI API Error: ${error.response.data.error.message}`);
        } else if (error.request) {
            // The request was made, but no response was received
            console.error('No response received from OpenAI API:', error.request);
            throw new Error('No response received from OpenAI API');
        } else {
            // Something else happened while setting up the request
            console.error('Error setting up the request:', error.message);
            throw new Error(`Error generating embedding: ${error.message}`);
        }
    }
};

function parseSubtasks(taskContent) {
    const sections = taskContent.split('\n\n');

    let subtasks = sections.map(section => {
        const headerMatch = section.match(/### Step (\d+): (.+)/);
        let stepNumber = headerMatch ? parseInt(headerMatch[1], 10) : null;
        let stepTitle = headerMatch ? headerMatch[2].trim() : null;

        let estimatedTime = "Variable"; // Default if not explicitly mentioned or if it's variable.
        const timeMatch = section.match(/- \*\*Estimated Time\*\*: (.+)/);

        if (timeMatch && timeMatch[1].trim() !== 'Variable') {
            estimatedTime = timeMatch[1].trim();
        }

        // Extract short description for the step
        const descriptionMatch = section.match(/- \*\*Description\*\*: (.+)/);
        let description = descriptionMatch ? descriptionMatch[1].trim() : "No description provided";

        return {
            stepNumber,
            stepTitle,
            description,
            estimatedTime
        };
    });

    return subtasks.filter(subtask => subtask.stepNumber !== null && subtask.stepTitle);
}

const generateDivTasks = async (req, res) => {
    const { task } = req.body;

    // Updated prompt to generalize for any project type
    const dividedTasks = await openai.chat.completions.create({
        model: "gpt-4-0125-preview",
        messages: [
            {
                role: 'user',
                content: `Imagine you are planning to complete the project "${task}". Break down this project into detailed steps required to accomplish it, regardless of the domain. If the project is coding-related, include detailed steps on completing the frontend, backend, and algorithmic logic. If the project involves developing a product, like a toy, include detailed steps on conceptualization, design, prototyping, testing, and production. For any project, provide comprehensive steps that guide someone through its completion.

For each step, include:

1. A title
2. A short description detailing what the step involves
3. An estimated completion time (use 'Variable' if the time cannot be estimated)

Format:

### Step <Number>: <Title>
- **Description**: <Description of the step>
- **Estimated Time**: <Hours> hours or 'Variable'`
            }
        ],
        max_tokens: 800,
    });

    const subtasks = parseSubtasks(dividedTasks.choices[0].message['content']);
    res.status(200).json({ subtasks });
    console.log(dividedTasks.choices[0].message['content']);
};

module.exports = { generateDivTasks, getEmbedding };
