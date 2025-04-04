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
  isRowActive: boolean;
  handleEditCell: (
    sectionId: string,
    stepId: string,
    key: string,
    value: string | boolean
  ) => void;
  handleDeleteRow: (sectionId: string, rowId: string) => void;
  handleDuplicateRow: (step: Step, sectionId: string) => void;
  handleRowClick: (row: Step, e: React.MouseEvent) => void;
}

export const TestPlanRow = ({
  step,
  sectionId,
  handleDeleteRow,
  handleDuplicateRow,
  handleEditCell,
  handleRowClick,
  isRowActive,
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
    transition,
  };

  const nestedLevel = step.nestedLevel || 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx("flex items-center", styles.row)}
      onClick={(e) => {
        e.stopPropagation();
        handleRowClick(step, e);
      }}
      onBlur={() => setFocusedInput(null)}
    >
      <input
        type="checkbox"
        className={clsx(styles.selectCheckbox)}
        checked={isRowActive}
      />
      <div
        className={styles.nestedLevelGap}
        style={{ width: `${nestedLevel * 10}px` }}
      >
        {" "}
      </div>
      <div {...listeners} {...attributes} className="cursor-grab" title="Drag">
        <DragIndicator />
      </div>
      <div className={clsx("flex flex-row rounded-sm", {
        ["border border-gray-400"]: focusedInput === "name" && isRowActive,
      })}>
        {focusedInput && isRowActive && <p>type</p>}
        <input
          defaultValue={step.name}
          onFocus={() => setFocusedInput("name")}
          onBlur={(e) => {
            handleEditCell(sectionId, step.id, "name", e.target.value);
          }}
          className={clsx(styles.textField, {
            ["underline"]: focusedInput === "name" && isRowActive,
            [styles.edit]: focusedInput === "name" && isRowActive,
          })}
        />
        {focusedInput && isRowActive && (
          <input
            onBlur={(e) => {
              handleEditCell(sectionId, step.id, "nameUnit", e.target.value);
            }}
            type="text"
            className={clsx(styles.textField, styles.edit)}
            defaultValue={step.nameUnit}
          />
        )}
      </div>
      <div className="flex flex-row">
        <VscodeSingleSelect
          className={clsx("pl-1", styles.selectField, "rounded-xl")}
          value={step.typeOfTest}
          onFocus={() => setFocusedInput("typeOfTest")}
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
        {focusedInput && isRowActive && (
          <div className="flex flex-row">
            <p>
              Dropdown
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-row">
        <VscodeCheckbox
          className="pl-1 ml-2"
          checked={!!step.onOrOff}
          onFocus={() => setFocusedInput("onOrOff")}
          onChange={(e) =>
            handleEditCell(
              sectionId,
              step.id,
              "onOrOff",
              (e.target as HTMLInputElement).checked
            )
          }
        />
        {focusedInput && isRowActive && (
          <div className="flex flex-row">
            <p>
              Checkbox
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
