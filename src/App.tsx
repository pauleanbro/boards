import { useState } from "react";
import KanbanBoard from "./components/KanbanBoard";
import GenerateTasksModal from "./components/GenerateTasksModal";
import { DropResult } from "react-beautiful-dnd";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Kanban } from "iconsax-react";

type Column = {
  id: string;
  name: string;
};

type Card = {
  id: string;
  title: string;
  description: string;
  columnId: string;
  order: number;
};

function App() {
  const [columns] = useState<Column[]>([
    { id: "todo", name: "A Fazer" },
    { id: "inProgress", name: "Em Progresso" },
    { id: "done", name: "Concluído" },
  ]);

  const [cards, setCards] = useState<Card[]>([]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    setCards((prevCards) => {
      const movedCard = prevCards.find((card) => card.id === draggableId);
      if (!movedCard) return prevCards;

      if (source.droppableId === destination.droppableId) {
        const updatedCards = prevCards
          .filter((card) => card.columnId === source.droppableId)
          .sort((a, b) => a.order - b.order);

        updatedCards.splice(source.index, 1);
        updatedCards.splice(destination.index, 0, movedCard);

        return prevCards.map((card) =>
          card.columnId === source.droppableId
            ? {
                ...card,
                order: updatedCards.findIndex((c) => c.id === card.id),
              }
            : card
        );
      }

      const sourceCards = prevCards
        .filter((card) => card.columnId === source.droppableId)
        .sort((a, b) => a.order - b.order);

      const destCards = prevCards
        .filter((card) => card.columnId === destination.droppableId)
        .sort((a, b) => a.order - b.order);

      sourceCards.splice(source.index, 1);
      destCards.splice(destination.index, 0, {
        ...movedCard,
        columnId: destination.droppableId,
      });

      const updatedSourceCards = sourceCards.map((card, index) => ({
        ...card,
        order: index,
      }));
      const updatedDestCards = destCards.map((card, index) => ({
        ...card,
        order: index,
      }));

      return [
        ...prevCards.filter(
          (card) =>
            card.columnId !== source.droppableId &&
            card.columnId !== destination.droppableId
        ),
        ...updatedSourceCards,
        ...updatedDestCards,
      ];
    });
  };

  const handleTasksGenerated = (
    generatedTasks: { title: string; description: string }[]
  ) => {
    setCards((prevCards) => {
      const newCards = generatedTasks.map((task, index) => ({
        id: (prevCards.length + index + 1).toString(),
        title: task.title,
        description: task.description,
        columnId: "todo",
        order:
          prevCards.filter((card) => card.columnId === "todo").length + index,
      }));
      return [...prevCards, ...newCards];
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <nav className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-2 items-center text-2xl font-bold">
            {" "}
            <Kanban size="32" color="#FF8A65" />
            Boards
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Projects
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Team
            </a>
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="/placeholder.svg?height=32&width=32"
                alt="User"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Kanban</h1>
          <GenerateTasksModal onTasksGenerated={handleTasksGenerated} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KanbanBoard columns={columns} cards={cards} onDragEnd={onDragEnd} />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              © 2024 Boards. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
