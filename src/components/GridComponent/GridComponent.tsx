import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
  RowSelectionOptions,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import { useMemo } from "react";

import styles from "./GridComponent.module.scss";
import { myTheme } from "./constants";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export const GridComponent = () => {
  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return { mode: "multiRow" };
  }, []);

  const rowData = useMemo(
    () => [
      { make: "Tesla", model: "Model Y", price: 64950, electric: true },
      { make: "Ford", model: "F-Series", price: 33850, electric: false },
      { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    ],
    []
  );

  // Column Definitions: Defines the columns to be displayed.
  const colDefs = useMemo<
    ColDef<{ make: string; model: string; price: number; electric: boolean }>[]
  >(
    () => [
      { field: "make", width: 100, editable: true },
      { field: "model", editable: true },
      { field: "price", editable: false },
      { field: "electric", editable: true },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      filter: true,
    };
  }, []);

  return (
    <div className={styles.table}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        rowSelection={rowSelection}
        domLayout="autoHeight"
        theme={myTheme}
        // onCellClicked={(det) => console.log(det)}
        // onCellEditingStarted={(det) => console.log(det, " edit start")}
        // onCellEditingStopped={(det) => console.log(det, " edit stop")}
        // onCellEditRequest={(det) => console.log(det, " edit req")}
      />
    </div>
  );
};
