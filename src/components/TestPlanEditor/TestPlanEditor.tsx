import { useState } from "react";
import { Box, Button } from "@mui/material";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { v4 as uuid } from "uuid";

import { TestPlanRow } from "./TestplanRow";

import { InOrOutEnum, Step, TestStepSection, TypeOfTestEnum } from "./types";

import styles from "./TestPlanEditor.module.scss";

export const TestPlanEditor = ({
  testSteps,
}: {
  testSteps: TestStepSection[];
}) => {
  const [stepsData, setStepsData] = useState<TestStepSection[]>(testSteps);
  const [draggedItem, setDraggedItem] = useState<Step | null>(null);

  const handleDeleteRow = (sectionId: string, rowId: string) => {
    setStepsData((prevSteps) =>
      prevSteps.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              steps: section.steps.filter((step) => step.id !== rowId),
            }
          : section
      )
    );
  };

  const handleAddRow = (sectionId: string) => {
    setStepsData((prevSteps) =>
      prevSteps.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              steps: [
                ...section.steps,
                {
                  id: uuid(),
                  name: "New Step",
                  typeOfTest: TypeOfTestEnum.NORMAL,
                  inOrOut: InOrOutEnum.INPUT,
                  onOrOff: false,
                  includedInDataSheet: true,
                },
              ],
            }
          : section
      )
    );
  };

  const handleEditCell = (
    sectionId: string,
    rowId: string,
    key: string,
    value: string | boolean
  ) => {
    setStepsData((prevSteps) =>
      prevSteps.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              steps: section.steps.map((step) =>
                step.id === rowId ? { ...step, [key]: value } : step
              ),
            }
          : section
      )
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id;
    const item = stepsData
      .flatMap((section) => section.steps)
      .find((step) => step.id === id);
    setDraggedItem(item ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
  
    if (!over) return;
  
    if (active.id !== over.id) {
      setStepsData((prevSteps) => {
        const updatedSteps = [...prevSteps];
        let sourceSection: TestStepSection | undefined,
          targetSection: TestStepSection | undefined;
        let activeStepIndex: number | undefined,
          overStepIndex: number | undefined;
  
        updatedSteps.forEach((section) => {
          const activeIndex = section.steps.findIndex(
            (step) => step.id === active.id
          );
          const overIndex = section.steps.findIndex(
            (step) => step.id === over.id
          );
  
          if (activeIndex !== -1) {
            sourceSection = section;
            activeStepIndex = activeIndex;
          }
  
          if (overIndex !== -1) {
            targetSection = section;
            overStepIndex = overIndex;
          }
        });
  
        if (
          !sourceSection ||
          !targetSection ||
          activeStepIndex === undefined ||
          overStepIndex === undefined
        ) {
          return prevSteps;
        }

        const [movedRow] = sourceSection.steps.splice(activeStepIndex, 1);
        targetSection.steps.splice(overStepIndex, 0, movedRow);
  
        return updatedSteps;
      });
    }
  
    setDraggedItem(null);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.container}>
        {stepsData.map((section) => (
          <SortableContext
            key={section.id}
            items={section.steps.map((step) => step.id)}
            strategy={verticalListSortingStrategy}
          >
            <Box sx={{ mb: 3, p: 2, border: "1px solid #ddd" }}>
              <div className={styles.sectionDescription}>
                <h6>{section.id}</h6>
                <ul>
                  {section.descriptionPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
              {section.steps.map((step) => (
                <TestPlanRow
                  key={step.id}
                  step={step}
                  sectionId={section.id}
                  handleDeleteRow={handleDeleteRow}
                  handleEditCell={handleEditCell}
                />
              ))}
              <Button
                onClick={() => handleAddRow(section.id)}
                variant="contained"
              >
                Add Row
              </Button>
            </Box>
          </SortableContext>
        ))}
      </div>
      <DragOverlay>
        {draggedItem && (
          <TestPlanRow
            step={draggedItem}
            sectionId={draggedItem.id}
            handleDeleteRow={handleDeleteRow}
            handleEditCell={handleEditCell}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};
