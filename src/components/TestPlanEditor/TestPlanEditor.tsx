import { v4 as uuid } from "uuid";
import { useState, useRef, useCallback, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  GridReadyEvent,
  GridApi,
  ColDef,
  ModuleRegistry,
  AllCommunityModule,
} from "ag-grid-community";
import {
  InOrOutEnum,
  OnOrOffEnum,
  Step,
  StepsEnum,
  TestStepSection,
  TypeOfTestEnum,
} from "./types";

import styles from "./TestPlanEditor.module.scss";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

interface TestPlanEditorProps {
  initialTestSteps: TestStepSection[];
}

export const TestPlanEditor = ({ initialTestSteps }: TestPlanEditorProps) => {
  const [testSteps, setTestSteps] =
    useState<TestStepSection[]>(initialTestSteps);
  const gridRefs = useRef<Record<string, GridApi | undefined>>({});

  const handleGridReady = useCallback(
    (params: GridReadyEvent, sectionId: string) => {
      gridRefs.current[sectionId] = params.api;
      params.api.sizeColumnsToFit();
    },
    []
  );

  interface ColumnDefParams {
    value: string | null | undefined;
    data: Step;
    api: GridApi;
  }

  const columnDefs: ColDef<Step>[] = useMemo(
    () => [
      {
        rowDrag: true,
        width: 40,
        suppressMovable: true,
        cellRenderer: () => <span className="drag-handle">&#9776;</span>, // Drag icon
        resizable: false,
      },
      {
        field: "name",
        editable: true,
        cellEditorParams: { skipHeaderOnFocus: true }, // Add skipHeaderOnFocus
        cellRenderer: (params: ColumnDefParams) =>
          params.value || <span className="text-gray-400">Click to edit!</span>,
        singleClickEdit: true,
      },
      {
        field: "typeOfTest",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: Object.values(TypeOfTestEnum),
          skipHeaderOnFocus: true,
        }, // Add skipHeaderOnFocus
        cellRenderer: (params: ColumnDefParams) =>
          params.value || <span className="text-gray-400">Click to edit!</span>,
        singleClickEdit: true,
      },
      {
        field: "inOrOut",
        headerName: "In/Out",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: Object.values(InOrOutEnum),
          skipHeaderOnFocus: true,
        }, // Add skipHeaderOnFocus
        cellRenderer: (params: ColumnDefParams) =>
          params.value || <span className="text-gray-400">Click to edit!</span>,
        singleClickEdit: true,
      },
      {
        field: "onOrOff",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: [null, ...Object.values(OnOrOffEnum)],
          skipHeaderOnFocus: true,
        }, // Add skipHeaderOnFocus
        cellRenderer: (params: ColumnDefParams) =>
          params.value || <span className="text-gray-400">Click to edit!</span>,
        singleClickEdit: true,
      },
      {
        field: "includedInDataSheet",
        editable: true,
        cellEditor: "agToggleCellEditor",
      },
      {
        headerName: "Delete",
        filter: false,
        cellRenderer: (params: ColumnDefParams) => (
          <button
            className="w-0.5 h-0.5 bg-green-500"
            onClick={() => {
              const updateTestSteps = testSteps.map((section) => {
                const updatedSteps = section.steps.filter((step) => {
                  return step !== params.data;
                });

                return { ...section, steps: updatedSteps };
              });
              setTestSteps(updateTestSteps);
            }}
          />
        ),
      },
    ],
    [testSteps]
  );

  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      resizable: true,
      filter: true,
    };
  }, []);

  const addRow = useCallback(
    (sectionId: string, index?: number) => {
      setTestSteps((prevSteps) => {
        const updatedSteps = prevSteps.map((section) => {
          if (section.id === sectionId) {
            const newRow: Step = {
              id: uuid(),
              name: StepsEnum.Step1,
              typeOfTest: TypeOfTestEnum.NORMAL,
              inOrOut: InOrOutEnum.INPUT,
              onOrOff: null,
              includedInDataSheet: true,
            };
            const newSteps = [...section.steps];

            if (index === undefined) {
              newSteps.push(newRow);
            } else {
              newSteps.splice(index, 0, newRow);
            }

            return { ...section, steps: newSteps };
          }
          return section;
        });
        return updatedSteps;
      });
    },
    [setTestSteps]
  );

  return (
    <div>
      {testSteps.map((section) => (
        <div className={styles.editorContainer} key={section.id}>
          <h3>{section.id}</h3>
          <ul>
            {section.descriptionPoints.map((desc, index) => (
              <li key={index}>{desc}</li>
            ))}
          </ul>
          <div className={styles.sectionTableContainer}>
            <AgGridReact
              className={`${styles.sectionTable} custom-ag-grid`}
              ref={(ref) => {
                if (ref) gridRefs.current[section.id] = ref.api;
              }}
              rowData={section.steps}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              rowDragManaged={true}
              onGridReady={(params) => handleGridReady(params, section.id)}
            />
          </div>
          <button onClick={() => addRow(section.id)}>Add Row</button>
        </div>
      ))}
    </div>
  );
};
