import clsx from "clsx";
import { v4 as uuid } from "uuid";
import copy from "copy-to-clipboard";
import { useCallback, useEffect, useRef, useState } from "react";
import { VscodeButton } from "@vscode-elements/react-elements";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { TestPlanRow } from "./TestplanRow";
import { TestPlanOverlay } from "./TestPlanOverlay";

import { addRowToSection, isObjectOfTypeStep, isStepVisible, moveRow } from "./utils";

import { Step, TestStepSection } from "./types";

import styles from "./TestPlanEditor.module.scss";

export const TestPlanEditor = ({
  testSteps,
}: {
  testSteps: TestStepSection[];
}) => {
  const [stepsData, setStepsData] = useState<TestStepSection[]>(testSteps);
  const [draggedItem, setDraggedItem] = useState<Step | null>(null);
  const [collapsedSteps, setCollapsedSteps] = useState<string[]>([]);
  const [activeRow, setActiveRow] = useState<Step | null>(null);
  const [rowIdToShowBorder, setRowIdToShowBorder] = useState<string | null>(
    null
  );
  const copiedRowRef = useRef<Step | null>(null);

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

  const handleAddRow = (
    sectionId: string,
    stepData: Step | null,
    insertNextToRowId: string | null = null
  ) => {
    const insertNextToRow = insertNextToRowId ?? activeRow?.id ?? null;

    setStepsData((prevSteps) =>
      addRowToSection(prevSteps, sectionId, stepData, insertNextToRow)
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
      setStepsData((prevSteps) =>
        moveRow(prevSteps, String(active.id), String(over.id))
      );
    }

    setDraggedItem(null);
    setRowIdToShowBorder(null);
  };

  const toggleCollapse = (sectionId: string) => {
    setCollapsedSteps((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleRowClick = (row: Step | null) => {
    setActiveRow(row);
  };

  const handlePaste = (event: React.ClipboardEvent, sectionId: string) => {
    event.preventDefault();

    const pastedText = event.clipboardData.getData("text/plain");

    try {
      const pastedData = JSON.parse(pastedText);

      if (isObjectOfTypeStep(pastedData)) {
        handleAddRow(sectionId, { ...pastedData, id: uuid() } as Step);
      }
    } catch (error) {
      console.debug("Invalid JSON data pasted:", error);
    }
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "c" && activeRow) {
        copiedRowRef.current = { ...activeRow, id: uuid() };
        copy(JSON.stringify({ ...activeRow, id: uuid() }));
      }
    },
    [activeRow]
  );

  const handleDuplicateRow = (step: Step, sectionId: string) => {
    const newStep = { ...step, id: uuid() };
    handleAddRow(sectionId, newStep, step.id);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeRow, handleKeyDown]);

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={(e) => {
        setRowIdToShowBorder(String(e.over!.id));
      }}
      onDragEnd={handleDragEnd}
    >
      <div
        className={styles.container}
        onClick={() => {
          setActiveRow(null);
        }}
      >
        {stepsData.map((section) => (
          <SortableContext
            key={section.id}
            items={section.steps.map((step) => step.id)}
            strategy={verticalListSortingStrategy}
          >
            <div
              className="border border-white rounded-md p-2 mb-2 max-h-100 overflow-auto"
              onPaste={(e) => handlePaste(e, section.id)}
            >
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
                  onClick={() => handleAddRow(section.id, null)}
                >
                  Add Row
                </VscodeButton>
              </div>
              {section.steps.map((step, index) => {
                const doesHaveNestedChildren = section.steps[index + 1]
                  ? section.steps[index + 1].nestedLevel > step.nestedLevel
                  : false;

                const isActiveRow = activeRow?.id === step.id;
                const shouldShowBorderBottom = rowIdToShowBorder === step.id;

                if (!isStepVisible(step, index, section.steps, collapsedSteps)) {
                  return null;
                }

                return (
                  <div
                    className={clsx("flex items-center", {
                      ["asfds"]: shouldShowBorderBottom,
                    })}
                    key={step.id}
                  >
                    {doesHaveNestedChildren ? (
                      <div
                        className="cursor-pointer w-1.5 mr-1"
                        onClick={() => toggleCollapse(step.id)}
                      >
                        {collapsedSteps.includes(step.id) ? <p>+</p> : <p>-</p>}
                      </div>
                    ) : (
                      <div className="w-1.5 mr-1" />
                    )}
                    <div
                      className={clsx({
                        ["border border-blue-700 rounded-lg"]: isActiveRow,
                        ["border-b border-amber-700 pb-0.5"]:
                          shouldShowBorderBottom,
                      })}
                    >
                      <TestPlanRow
                        key={step.id}
                        step={step}
                        sectionId={section.id}
                        handleDeleteRow={handleDeleteRow}
                        handleDuplicateRow={handleDuplicateRow}
                        handleEditCell={handleEditCell}
                        handleRowClick={handleRowClick}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </SortableContext>
        ))}
      </div>
      <TestPlanOverlay draggedItem={draggedItem} />
    </DndContext>
  );
};
