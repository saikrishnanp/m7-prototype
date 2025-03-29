import { useSortable } from "@dnd-kit/sortable";
import { Step, TypeOfTestEnum } from "./types";
import {
  Box,
  IconButton,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
import { Delete, DragIndicator } from "@mui/icons-material";

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
      <Select
        value={step.typeOfTest}
        onChange={(e) =>
          handleEditCell(sectionId, step.id, "typeOfTest", e.target.value)
        }
        size="small"
      >
        <MenuItem value={TypeOfTestEnum.NORMAL}>Normal</MenuItem>
        <MenuItem value={TypeOfTestEnum.LOAD}>Load</MenuItem>
      </Select>
      <Switch
        checked={!!step.onOrOff}
        onChange={(e) =>
          handleEditCell(sectionId, step.id, "onOrOff", e.target.checked)
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
