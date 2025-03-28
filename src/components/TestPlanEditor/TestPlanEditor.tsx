import { useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton, Button, Typography } from "@mui/material";
import { Delete, DragIndicator } from "@mui/icons-material";
import { v4 as uuid } from "uuid";
import { InOrOutEnum, Step, TestStepSection, TypeOfTestEnum } from "./types";

export const TestPlanEditor = ({ testSteps }: { testSteps: TestStepSection[] }) => {
  const [stepsData, setStepsData] = useState<TestStepSection[]>(testSteps);
  const [draggedRow, setDraggedRow] = useState<{row: Step, sectionId: string} | null>(null);

  const handleDeleteRow = (sectionId: string, rowId: string) => {
    setStepsData((prevSteps) =>
      prevSteps.map((section) =>
        section.id === sectionId
          ? { ...section, steps: section.steps.filter((step) => step.id !== rowId) }
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
                  onOrOff: null,
                  includedInDataSheet: true,
                },
              ],
            }
          : section
      )
    );
  };

  const handleDragStart = (row: Step, sectionId: string) => {
    setDraggedRow({ row, sectionId });
  };

  const handleDrop = (targetSectionId: string) => {
    if (!draggedRow) return;
    
    const { row, sectionId: sourceSectionId } = draggedRow;

    if (sourceSectionId !== targetSectionId) {
      setStepsData((prevSteps) => {
        return prevSteps.map((section) => {
          if (section.id === sourceSectionId) {
            // Remove row from source section (create a new steps array)
            const updatedSourceSteps = section.steps.filter((step) => step.id !== row.id);
            return { ...section, steps: updatedSourceSteps };
          } else if (section.id === targetSectionId) {
            // Add row to target section (create a new steps array)
            const updatedTargetSteps = [...section.steps, row];
            return { ...section, steps: updatedTargetSteps };
          }
          return section;
        });
      });
    }

    setDraggedRow(null);
};

  return (
    <Box>
      {stepsData.map((section) => (
        <Box
          key={section.id}
          sx={{ mb: 3, p: 2, border: "1px solid #ddd" }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(section.id)}
        >
          <Typography variant="h6">{section.id}</Typography>
          <ul>
            {section.descriptionPoints.map((desc, index) => (
              <li key={index}>{desc}</li>
            ))}
          </ul>
          <MaterialReactTable
            columns={[
              {
                accessorKey: "drag",
                header: "Drag",
                enableSorting: false,
                enableColumnActions: false,
                Cell: ({ row }) => (
                  <div
                    draggable
                    onDragStart={() => handleDragStart(row.original, section.id)}
                    style={{ cursor: "grab" }}
                  >
                    <DragIndicator />
                  </div>
                ),
              },
              { accessorKey: "name", header: "Name" },
              { accessorKey: "typeOfTest", header: "Type of Test" },
              { accessorKey: "inOrOut", header: "In or Out" },
              {
                accessorKey: "onOrOff",
                header: "On or Off",
                Cell: ({ cell }) => cell.getValue() || <span style={{ color: "gray" }}>Unset</span>,
              },
              {
                accessorKey: "includedInDataSheet",
                header: "Included",
                Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
              },
              {
                accessorKey: "actions",
                header: "Actions",
                enableSorting: false,
                enableColumnActions: false,
                Cell: ({ row }) => (
                  <IconButton
                    onClick={() => handleDeleteRow(section.id, row.original.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                ),
              },
            ]}
            data={section.steps}
            enableSorting={false}
            enableRowNumbers={false}
            enableFilters={false}
            enableColumnOrdering={false}
            enableRowOrdering={false}
            muiTableHeadProps={{ sx: { display: "none" } }}
            muiTableProps={{ sx: { tableLayout: "auto" } }}
          />
          <Button onClick={() => handleAddRow(section.id)} variant="contained" sx={{ mt: 2 }}>
            Add Row
          </Button>
        </Box>
      ))}
    </Box>
  );
};
