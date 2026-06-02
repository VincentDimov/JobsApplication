import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult
} from "@hello-pangea/dnd";

type Stage = "new" | "screening" | "interview" | "offer" | "rejected";

type CandidateCard = {
  id: string;
  stage: Stage;
  candidates: {
    id: string;
    name: string;
    email: string | null;
    linkedin_url: string | null;
  };
};

const STAGES: { id: Stage; label: string }[] = [
  { id: "new", label: "New" },
  { id: "screening", label: "Screening" },
  { id: "interview", label: "Interview" },
  { id: "offer", label: "Offer" },
  { id: "rejected", label: "Rejected" }
];

export const KanbanBoard: React.FC<{
  items: CandidateCard[];
  onDragEnd: (result: DropResult) => void;
}> = ({ items, onDragEnd }) => {
  // Gruppar kandidater per stage
  const grouped = STAGES.reduce((acc, stage) => {
    acc[stage.id] = items.filter((i) => i.stage === stage.id);
    return acc;
  }, {} as Record<Stage, CandidateCard[]>);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-5 gap-4">
        {STAGES.map((stage) => (
          <Droppable droppableId={stage.id} key={stage.id}>
            {(provided) => (
              <div
                className="bg-slate-50 rounded border border-slate-200 flex flex-col"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className="px-3 py-2 border-b text-xs font-semibold uppercase text-slate-600">
                  {stage.label} ({grouped[stage.id].length})
                </div>

                <div className="p-2 space-y-2 flex-1 min-h-[200px]">
                  {grouped[stage.id].map((item, index) => (
                    <Draggable
                      draggableId={String(item.id)}
                      index={index}
                      key={item.id}
                    >
                      {(provided) => (
                        <div
                          className="bg-white rounded shadow-sm px-3 py-2 text-xs space-y-1 cursor-grab active:cursor-grabbing"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="font-medium">
                            {item.candidates?.name}
                          </div>

                          {item.candidates?.email && (
                            <div className="text-[11px] text-slate-500">
                              {item.candidates.email}
                            </div>
                          )}

                          {item.candidates?.linkedin_url && (
                            <a
                              href={item.candidates.linkedin_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-blue-600 hover:underline"
                            >
                              LinkedIn
                            </a>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}

                  {grouped[stage.id].length === 0 && (
                    <div className="text-[11px] text-slate-400 text-center py-4">
                      Inga kandidater
                    </div>
                  )}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};
