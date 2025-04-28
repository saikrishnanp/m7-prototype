// import { useState } from "react";

import { TestPlanEditorPage } from "src/components/TestPlanEditor/TestPlanEditorPage";

// import { TestComponent } from "src/components/TestComponent/TestComponent";
// import { CounterComponent } from "src/components/CounterComponent/CounterComponent";
// import { AxiosComponent } from "src/components/AxiosComponent/AxiosComponent";
// import { GridComponent } from "src/components/GridComponent/GridComponent";

export const LandingPage = () => {

  return (
    <div className="flex flex-row items-center">
      {/* <CounterComponent /> */}
      {/* <TestComponent /> */}
      {/* <AxiosComponent /> */}
      {/* <GridComponent /> */}
      <ul>
        <li>Test Plan Editor</li>
        <li>Test Plan Runner</li>
        <li>Test Plan Results</li>
        <li>Test Plan History</li>
        <li>Test Plan Settings</li>
        <li>Test Plan Documentation</li>
        <li>Test Plan Support</li>
      </ul>
      <TestPlanEditorPage />
    </div>
  );
};
