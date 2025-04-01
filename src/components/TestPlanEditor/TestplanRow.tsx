import clsx from "clsx";
import { useSortable } from "@dnd-kit/sortable";
import { Box, IconButton } from "@mui/material";
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

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{ display: "flex", alignItems: "center", mb: 1 }}
    >
      <IconButton size="small" {...listeners} {...attributes}>
        <DragIndicator />
      </IconButton>
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
        className="pl-1"
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
    </Box>
  );
};
