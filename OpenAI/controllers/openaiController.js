const openai = require('../config/openaiconfig');

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

module.exports = { generateDivTasks };
