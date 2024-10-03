import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { generateTasks } from "../services/geminiService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Magicpen } from "iconsax-react";

type GenerateTasksModalProps = {
  onTasksGenerated: (tasks: { title: string; description: string }[]) => void;
};

const GenerateTasksModal: React.FC<GenerateTasksModalProps> = ({
  onTasksGenerated,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<{ inputText: string }>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerateTasks = async (data: { inputText: string }) => {
    if (!data.inputText.trim()) {
      alert("Por favor, insira um texto.");
      return;
    }

    try {
      const apiKey = import.meta.env.VITE_GEMINI_KEY;
      const generatedTasks = await generateTasks(data.inputText, apiKey);
      onTasksGenerated(generatedTasks);
      reset(); // Reset form fields to their default values
      setIsModalOpen(false); // Close the modal after success
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className="bg-black text-white hover:bg-gray-800"
          onClick={() => setIsModalOpen(true)}
        >
          Generate with AI
          <Magicpen size="20" color="#FFF" className="ml-2" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form onSubmit={handleSubmit(handleGenerateTasks)}>
          <AlertDialogHeader>
            <AlertDialogTitle>Gerar Tarefas</AlertDialogTitle>
            <AlertDialogDescription>
              Insira o texto abaixo para gerar as tarefas correspondentes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <textarea
            className="w-full p-2 border rounded mb-4"
            rows={4}
            {...register("inputText")}
            placeholder="Digite o texto aqui..."
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsModalOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Gerando..." : "Gerar"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GenerateTasksModal;
