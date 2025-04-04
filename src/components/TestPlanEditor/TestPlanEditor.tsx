import clsx from "clsx";
import { v4 as uuid } from "uuid";
import copy from "copy-to-clipboard";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { Fullscreen, CloseFullscreen } from "@mui/icons-material";

import { TestPlanOverlay } from "./TestPlanOverlay";
import { TestPlanSection } from "./TestPlanSection";

import { addRowToSection, isListOfTypeStep, moveRow } from "./utils";

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
  const [activeRows, setActiveRows] = useState<Step[]>([]);
  const [rowIdToShowBorder, setRowIdToShowBorder] = useState<string | null>(
    null
  );
  const [isFullScreen, setIsFullScreen] = useState(false);
  const copiedRowRef = useRef<Step[]>([]);

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
    const insertNextToRow =
      insertNextToRowId ?? activeRows[activeRows.length - 1].id ?? null;

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

  const handleRowClick = (row: Step, e: React.MouseEvent) => {
    console.log(e.ctrlKey, e.shiftKey, row.id);
    if (!e.ctrlKey) {
      return setActiveRows((prev) => {
        if (prev.map((item) => item.id).includes(row.id)) {
          return prev.filter((item) => item.id !== row.id);
        }
        return [row];
      });
    }

    setActiveRows((prev) => {
      if (prev.map((item) => item.id).includes(row.id)) {
        return prev.filter((item) => item.id !== row.id);
      }
      return [...prev, row];
    });
  };

  const handlePaste = (event: React.ClipboardEvent, sectionId: string) => {
    event.preventDefault();

    const pastedText = event.clipboardData.getData("text/plain");

    try {
      const pastedData = JSON.parse(pastedText) as Step[];
      console.log(pastedData, typeof pastedData, " asf");

      if (isListOfTypeStep(pastedData)) {
        pastedData.forEach((step) => {
          handleAddRow(sectionId, { ...step, id: uuid() });
        });
      }
    } catch (error) {
      console.debug("Invalid JSON data pasted:", error);
    }
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "c" && activeRows) {
        copiedRowRef.current = [...activeRows];
        copy(JSON.stringify(activeRows));
      }
    },
    [activeRows]
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
  }, [activeRows, handleKeyDown]);

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
        className={clsx(
          styles.container,
          {
            [styles.fullScreen]: isFullScreen,
          },
          "p-10"
        )}
        onClick={() => {
          setActiveRows([]);
        }}
      >
        <button
          type="button"
          className={styles.expandButton}
          onClick={() => setIsFullScreen((prev) => !prev)}
        >
          {isFullScreen ? (
            <CloseFullscreen className={styles.screenIcon} />
          ) : (
            <Fullscreen className={styles.screenIcon} />
          )}
        </button>
        {stepsData.map((section) => (
          <TestPlanSection
            key={section.id}
            section={section}
            activeRows={activeRows}
            isFullScreen={isFullScreen}
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
