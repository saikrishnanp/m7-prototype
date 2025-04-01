import { VscodeButton } from "@vscode-elements/react-elements";
import { useState } from "react";
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

import {
  findStepIndices,
  getMovedRowWithNestedLevel,
} from "./utils";

import { InOrOutEnum, Step, TestStepSection, TypeOfTestEnum } from "./types";

import styles from "./TestPlanEditor.module.scss";

export const TestPlanEditor = ({
  testSteps,
}: {
  testSteps: TestStepSection[];
}) => {
  const [stepsData, setStepsData] = useState<TestStepSection[]>(testSteps);
  const [draggedItem, setDraggedItem] = useState<Step | null>(null);
  const [collapsedSteps, setCollapsedSteps] = useState<{
    [key: string]: boolean;
  }>({});

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
                  nestedLevel: 0,
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

        const { sourceSection, targetSection, activeStepIndex, overStepIndex } =
          findStepIndices(updatedSteps, String(active.id), String(over.id));

        if (
          !sourceSection ||
          !targetSection ||
          activeStepIndex === undefined ||
          overStepIndex === undefined
        ) {
          return prevSteps;
        }

        const [movedRow] = sourceSection.steps.splice(activeStepIndex, 1);

        const movedRowWithNestedLevel = getMovedRowWithNestedLevel(
          movedRow,
          targetSection,
          overStepIndex
        );

        targetSection.steps.splice(overStepIndex, 0, movedRowWithNestedLevel);

        return updatedSteps;
      });
    }

    setDraggedItem(null);
  };

  const toggleCollapse = (sectionId: string) => {
    setCollapsedSteps((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const isStepVisible = (step: Step, index: number, steps: Step[]) => {
    for (let i = index - 1; i >= 0; i--) {
      if (
        step.nestedLevel > steps[i].nestedLevel &&
        collapsedSteps[steps[i].id]
      ) {
        return false;
      }
    }
    return true;
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
            <div className="border border-white rounded-md p-2 mb-2 max-h-100 overflow-auto">
              <div className="flex justify-between items-center mb-2">
                <div className={styles.sectionDescription}>
                  <h6>{section.id}</h6>
                  <ul>
                    {section.descriptionPoints.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
                <VscodeButton
                  className="p-1 rounded-sm"
                  type="button"
                  onClick={() => handleAddRow(section.id)}
                >
                  Add Row
                </VscodeButton>
              </div>
              {section.steps.map((step, index) => {
                const doesHaveNestedChildren = section.steps[index + 1]
                  ? section.steps[index + 1].nestedLevel > step.nestedLevel
                  : false;

                if (!isStepVisible(step, index, section.steps)) {
                  return null;
                }

                return (
                  <div className="flex items-center" key={step.id}>
                    {doesHaveNestedChildren ? (
                      <div
                        className="cursor-pointer w-1.5 mr-1"
                        onClick={() => toggleCollapse(step.id)}
                      >
                        {collapsedSteps[step.id] ? <p>+</p> : <p>-</p>}
                      </div>
                    ) : (
                      <div className="w-1.5 mr-1" />
                    )}
                    <TestPlanRow
                      key={step.id}
                      step={step}
                      sectionId={section.id}
                      handleDeleteRow={handleDeleteRow}
                      handleEditCell={handleEditCell}
                    />
                  </div>
                );
              })}
            </div>
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
