import clsx from "clsx";
import { useSortable } from "@dnd-kit/sortable";
import { IconButton } from "@mui/material";
import { Delete, DragIndicator, FileCopy } from "@mui/icons-material";

import { TestStep, TestStepActionEnum } from "./types";

import styles from "./TestPlanEditor.module.scss";
import { isCommentStep, isTestStep } from "./utils";
import { ComboboxComponent } from "./ComboboxComponent";

interface ITestPlanRowProps {
  step: TestStep;
  blockId: string;
  isRowActive: boolean;
  handleEditCell: (
    blockId: string,
    stepId: string,
    key: string,
    value: string | boolean
  ) => void;
  handleDeleteRow: (blockId: string, rowId: string) => void;
  handleDuplicateRow: (step: TestStep, blockId: string) => void;
  handleRowClick: (row: TestStep, e: React.MouseEvent) => void;
}

export const TestPlanRow = ({
  step,
  blockId,
  handleDeleteRow,
  handleDuplicateRow,
  handleEditCell,
  handleRowClick,
  isRowActive,
}: ITestPlanRowProps) => {
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

  const nestedLevel = isTestStep(step) ? step.nestedLevel : 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx("flex items-center", styles.row)}
      onClick={(e) => {
        e.stopPropagation();
        handleRowClick(step, e);
      }}
    >
      <input
        type="checkbox"
        className={clsx(styles.selectCheckbox)}
        checked={isRowActive}
        onChange={() => {}}
      />
      <div
        className={styles.nestedLevelGap}
        style={{ width: `${nestedLevel * 10}px` }}
      >
        {" "}
      </div>
      {isTestStep(step) && (
        <div
          {...listeners}
          {...attributes}
          className="cursor-grab"
          title="Drag"
        >
          <DragIndicator />
        </div>
      )}
      {isTestStep(step) && (
        <>
          {/* <div className={clsx(styles.textFieldCont, "flex flex-row")}> */}
          <ComboboxComponent
            value={step.action}
            options={Object.values(TestStepActionEnum)}
            placeholder="Action"
            onChange={(e) => {
              handleEditCell(blockId, step.id, "action", e!);
            }}
          />
          {/* </div> */}
          <div className={clsx(styles.textFieldCont, "flex flex-row")}>
            <ComboboxComponent
              value={step.subAction}
              options={Object.values(TestStepActionEnum)}
              placeholder="Subaction"
              onChange={(e) => {
                handleEditCell(blockId, step.id, "subAction", e!);
              }}
            />
          </div>
          <div className={clsx(styles.textFieldCont, "flex flex-row")}>
            <input
              type="text"
              className={clsx(styles.textField, "border-none")}
              value={step.pin || ""}
              placeholder="Pin"
              onChange={(e) =>
                handleEditCell(blockId, step.id, "resource", e.target.value)
              }
            />
          </div>
          <div className={clsx(styles.textFieldCont, "flex flex-row")}>
            <input
              type="text"
              className={clsx(styles.textField, "border-none")}
              value={step.resource || ""}
              placeholder="Resource"
              onChange={(e) =>
                handleEditCell(blockId, step.id, "resource", e.target.value)
              }
            />
          </div>
        </>
      )}
      {isCommentStep(step) && (
        <div className={clsx(styles.commentText, "text-green-700 pl-2")}>
          {step.comment}
        </div>
      )}
      <IconButton
        className={styles.duplicateButton}
        onClick={(e) => {
          e.stopPropagation();
          handleDuplicateRow(step, blockId);
        }}
        color="info"
      >
        <FileCopy />
      </IconButton>
      <IconButton
        className={styles.deleteButton}
        onClick={() => handleDeleteRow(blockId, step.id)}
        color="error"
      >
        <Delete />
      </IconButton>
    </div>
  );
};
