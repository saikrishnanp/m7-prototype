import clsx from "clsx";
import { useSortable } from "@dnd-kit/sortable";
import { IconButton } from "@mui/material";
import {
  VscodeOption,
  VscodeSingleSelect,
  VscodeCheckbox,
} from "@vscode-elements/react-elements";
import { Delete, DragIndicator } from "@mui/icons-material";

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
}

export const TestPlanRow = ({
  step,
  sectionId,
  handleDeleteRow,
  handleEditCell,
}: ITestPlanRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: step.id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  const nestedLevel = step.nestedLevel || 0;

  return (
    <div ref={setNodeRef} style={style} className="flex items-center">
      <div
        className={styles.nestedLevelGap}
        style={{ width: `${nestedLevel * 10}px` }}
      >
        {" "}
      </div>
      <div {...listeners} {...attributes} className="cursor-grab" title="Drag">
        <DragIndicator />
      </div>
      <input
        defaultValue={step.name}
        onBlur={(e) =>
          handleEditCell(sectionId, step.id, "name", e.target.value)
        }
        className={styles.textField}
      />
      <VscodeSingleSelect
        className={clsx("pl-1", styles.selectField, "rounded-xl")}
        value={step.typeOfTest}
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
      <VscodeCheckbox
        className="pl-1 ml-2"
        checked={!!step.onOrOff}
        onChange={(e) =>
          handleEditCell(
            sectionId,
            step.id,
            "onOrOff",
            (e.target as HTMLInputElement).checked
          )
        }
      />
      <IconButton
        onClick={() => handleDeleteRow(sectionId, step.id)}
        color="error"
      >
        <Delete />
      </IconButton>
    </div>
  );
};
