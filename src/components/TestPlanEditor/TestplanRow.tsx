import clsx from "clsx";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { IconButton } from "@mui/material";
import {
  VscodeOption,
  VscodeSingleSelect,
  VscodeCheckbox,
} from "@vscode-elements/react-elements";
import { Delete, DragIndicator, FileCopy } from "@mui/icons-material";

import { Step, TypeOfTestEnum } from "./types";

import styles from "./TestPlanEditor.module.scss";

interface ITestPlanRowProps {
  step: Step;
  sectionId: string;
  handleEditCell: (
    sectionId: string,
    stepId: string,
    key: string,
    value: string | boolean
  ) => void;
  handleDeleteRow: (sectionId: string, rowId: string) => void;
  handleDuplicateRow: (step: Step, sectionId: string) => void;
  handleRowClick: (row: Step) => void;
}

export const TestPlanRow = ({
  step,
  sectionId,
  handleDeleteRow,
  handleDuplicateRow,
  handleEditCell,
  handleRowClick,
}: ITestPlanRowProps) => {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ 
      id: step.id, 
      animateLayoutChanges: () => false,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
      transition
  };

  const nestedLevel = step.nestedLevel || 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx("flex items-center", styles.row)}
      onClick={(e) => {
        e.stopPropagation();
        handleRowClick(step);
      }}
    >
      <div
        className={styles.nestedLevelGap}
        style={{ width: `${nestedLevel * 10}px` }}
      >
        {" "}
      </div>
      <div {...listeners} {...attributes} className="cursor-grab" title="Drag">
        <DragIndicator />
      </div>
      <div className="flex flex-row">
        <input
          defaultValue={step.name}
          onFocus={() => setFocusedInput("name")}
          onBlur={(e) => {
            setFocusedInput(null);
            handleEditCell(sectionId, step.id, "name", e.target.value);
          }}
          className={styles.textField}
        />
        {focusedInput === "name" && (
          <div className="flex flex-row">
            <p>
              <strong>Type:</strong> Text
            </p>
            <p>
              <strong>Unit:</strong> N/A
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-row">
        <VscodeSingleSelect
          className={clsx("pl-1", styles.selectField, "rounded-xl")}
          value={step.typeOfTest}
          onFocus={() => setFocusedInput("typeOfTest")}
          onBlur={() => setFocusedInput(null)}
          onChange={(e) => {
            const target = e.target as HTMLSelectElement;
            handleEditCell(sectionId, step.id, "typeOfTest", target.value);
          }}
        >
          <VscodeOption value={TypeOfTestEnum.NORMAL}>
            {TypeOfTestEnum.NORMAL}
          </VscodeOption>
          <VscodeOption value={TypeOfTestEnum.LOAD}>
            {TypeOfTestEnum.LOAD}
          </VscodeOption>
        </VscodeSingleSelect>
        {focusedInput === "typeOfTest" && (
          <div className="flex flex-row">
            <p>
              <strong>Type:</strong> Dropdown
            </p>
            <p>
              <strong>Unit:</strong> N/A
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-row">
        <VscodeCheckbox
          className="pl-1 ml-2"
          checked={!!step.onOrOff}
          onFocus={() => setFocusedInput("onOrOff")}
          onBlur={() => setFocusedInput(null)}
          onChange={(e) =>
            handleEditCell(
              sectionId,
              step.id,
              "onOrOff",
              (e.target as HTMLInputElement).checked
            )
          }
        />
        {focusedInput === "onOrOff" && (
          <div className="flex flex-row">
            <p>
              <strong>Type:</strong> Checkbox
            </p>
            <p>
              <strong>Unit:</strong> Boolean
            </p>
          </div>
        )}
      </div>
      <IconButton
        className={styles.duplicateButton}
        onClick={(e) => {
          e.stopPropagation();
          handleDuplicateRow(step, sectionId);
        }}
        color="info"
      >
        <FileCopy />
      </IconButton>
      <IconButton
        className={styles.deleteButton}
        onClick={() => handleDeleteRow(sectionId, step.id)}
        color="error"
      >
        <Delete />
      </IconButton>
    </div>
  );
};
