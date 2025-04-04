import { v4 as uuid } from "uuid";
import copy from "copy-to-clipboard";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";

import { TestPlanOverlay } from "./TestPlanOverlay";
import { TestPlanSection } from "./TestPlanSection";

import {
  addRowToSection,
  isObjectOfTypeStep,
  moveRow,
} from "./utils";

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
      onDragStart={(e) => {
        handleDragStart(e);
      }}
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
          <TestPlanSection
key={section.id}
            section={section}
            activeRow={activeRow}
            collapsedSteps={collapsedSteps}
            rowIdToShowBorder={rowIdToShowBorder}
            handleAddRow={handleAddRow}
            handlePaste={handlePaste}
            handleDeleteRow={handleDeleteRow}
            handleDuplicateRow={handleDuplicateRow}
            handleRowClick={handleRowClick}
            handleEditCell={handleEditCell}
            toggleCollapse={toggleCollapse}
          />
        ))}
      </div>
      <TestPlanOverlay draggedItem={draggedItem} />
    </DndContext>
  );
};
