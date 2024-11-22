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

The language of the tasks must match the language of the input text. This applies to any type of instructional text, whether simple or complex. Follow these specific guidelines:

1. If the text requests a recipe (e.g., "recipe for chocolate cake," "how to make pizza"), generate the recipe as step-by-step tasks. Each task should be a clear and concise action, including preparatory steps (e.g., "Preheat the oven," "Chop the vegetables") and the actual preparation process (e.g., "Mix the ingredients," "Bake for 30 minutes at 180°C"). Provide details such as quantities or tools required when possible.

2. For any type of instructional text, whether recipes or general instructions, break down the process into actionable, easy-to-follow steps with concise descriptions. The tasks should match the complexity of the input text. For example:
   - Simple instructions like "how to prepare a salad" should have tasks such as "Wash the lettuce," "Chop the vegetables," and "Add dressing."
   - Complex instructions like "set up a CRUD system for users in Node.js" should include detailed tasks, such as "Install Express and set up a server" and "Create routes for user management."

3. For tasks related to general advice or tips (e.g., "weight loss tips," "how to improve productivity"), generate actionable tasks with specific suggestions. For example:
   - "Exercise regularly" could be broken into "Do 30 minutes of jogging daily" and "Include strength training twice a week."
   - "Improve focus" could include "Eliminate distractions: Keep your phone in another room" and "Use the Pomodoro technique for work sessions."

4. Ensure the output always matches the language of the input text.

Input Text: ${inputText}
`,
            },
          ],
        },
      ],
    };

    const response = await axiosInstance.post(url, body);
    const content =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
      throw new Error("O retorno não contém um JSON válido.");
    }

    const cleanedContent = jsonMatch[1].trim();

    let tasks;
    try {
      tasks = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, cleanedContent);
      throw new Error(
        "O texto retornado pelo serviço não é um JSON válido. Verifique a formatação."
      );
    }

    return tasks as { title: string; description: string }[];
  } catch (error) {
    console.error("Erro ao gerar tarefas:", error);
    throw new Error(
      "Ocorreu um erro ao gerar as tarefas. Por favor, tente novamente."
    );
  }
};
