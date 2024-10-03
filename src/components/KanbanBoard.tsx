import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddCircle } from "iconsax-react";

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

type KanbanBoardProps = {
  columns: Column[];
  cards: Card[];
  onDragEnd: (result: DropResult) => void;
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  cards,
  onDragEnd,
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {columns.map((column) => {
        const columnCards = cards
          .filter((card) => card.columnId === column.id)
          .sort((a, b) => a.order - b.order);

        return (
          <div key={column.id} className="bg-gray-50 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">{column.name}</h2>
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {columnCards.map((card, index) => (
                    <Draggable
                      key={card.id}
                      draggableId={card.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Card
                          className={`mb-2 cursor-pointer hover:bg-gray-100 transition-colors bg-white border-gray-200 ${
                            snapshot.isDragging ? "bg-slate-100" : "bg-white"
                          }`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              {card.title}
                            </CardTitle>
                          </CardHeader>

                          <CardContent>
                            <p className="text-xs text-gray-500">
                              {card.description}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Button
              variant="outline"
              className="w-full mt-2 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <AddCircle size="16" color="#000" className="mr-2" />
              Add a card
            </Button>
          </div>
        );
      })}
    </DragDropContext>
  );
};

export default KanbanBoard;
