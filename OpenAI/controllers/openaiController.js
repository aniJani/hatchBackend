const openai = require('../config/openaiconfig');

function parseSubtasks(taskContent) {
    const sections = taskContent.split('\n\n');

    let subtasks = sections.map(section => {
        const headerMatch = section.match(/### Step (\d+): (.+)/);
        let stepNumber = headerMatch ? parseInt(headerMatch[1], 10) : null;
        let stepTitle = headerMatch ? headerMatch[2].trim() : null;

        let estimatedTime = "Variable"; // Default if not explicitly mentioned or if it's variable.
        const timeMatch = section.match(/- \*\*Estimated Time\*\*: (.+)/); // Adjusted to capture any following text.

        if (timeMatch && timeMatch[1].trim() !== 'Variable') {
            estimatedTime = timeMatch[1].trim(); // Could be "X hours" or "Variable"; directly use the matched text.
        }

        return {
            stepNumber,
            stepTitle,
            estimatedTime
        };
    });

    return subtasks.filter(subtask => subtask.stepNumber !== null && subtask.stepTitle);
}

const generateDivTasks = async (req, res) => {
    const { task } = req.body;
    const dividedTasks = await openai.chat.completions.create({
        model: "gpt-4-0125-preview",
        messages: [
            {
                role: 'user',
                content: `Quickly break down the task "${task}" into steps with titles and estimated completion times. Use 'Variable' for times that can't be estimated. Format:

                ### Step <Number>: <Title>
                - **Estimated Time**: <Hours> hours or 'Variable'`
            }
        ],
        max_tokens: 800,
    });
    const subtasks = parseSubtasks(dividedTasks.choices[0].message['content']);
    res.status(200).json({ subtasks });
    console.log(dividedTasks.choices[0].message['content']);
};

module.exports = { generateDivTasks }