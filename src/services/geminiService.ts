import axiosInstance from "../api/axiosInstance";

export const generateTasks = async (inputText: string, apiKey: string) => {
  try {
    const url = `/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    const body = {
      contents: [
        {
          parts: [
            {
              text: `Read the provided text and generate tasks based on its content. The output should be a JSON array, where each task is represented as an object with two keys: "title" and "description".
              The language of the tasks must match the language of the input text.
              This applies to any type of instructional text, whether simple or complex. Ensure the following:

              For simple tasks, like a recipe or method of preparation (e.g., 'vegetable cake recipe' or 'how to make a salad'), break the process into clear, step-by-step tasks (e.g., 'Buy ingredients', 'Mix ingredients') with concise descriptions for each step.
              For general instructional texts, such as tips or advice (e.g., 'weight loss tips'), generate actionable tasks (e.g., 'Do physical exercise') and break them down into specific actions (e.g., 'Exercise: 30 minutes of jogging', 'Diet: Reduce sugar intake by 50%').
              For more complex tasks, such as 'create a CRUD for users in Node.js', provide detailed descriptions of each development step (e.g., 'Set up an Express server and define routes for user management').
              For general task descriptions (e.g., 'Fix the site header, implement search functionality'), generate tasks with descriptions matching the level of detail provided.
              The descriptions must reflect the complexity of the task, with simple tasks broken into clear steps and complex tasks explained in as much detail as possible. The output language must always be the same as the input language.

              Text: ${inputText}`,
            },
          ],
        },
      ],
    };

    const response = await axiosInstance.post(url, body);

    const content =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const jsonString = content
      .replace(/^```json\n/, "")
      .replace(/\n```$/, "")
      .trim();

    return JSON.parse(jsonString) as { title: string; description: string }[];
  } catch (error) {
    console.error("Erro ao gerar tarefas:", error);
    throw new Error(
      "Ocorreu um erro ao gerar as tarefas. Por favor, tente novamente."
    );
  }
};
