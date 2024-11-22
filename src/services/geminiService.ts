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
              Text: ${inputText}`,
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
