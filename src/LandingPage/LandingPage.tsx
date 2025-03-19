// import { useState } from "react";

import { TestComponent } from "src/components/TestComponent/TestComponent";
import { CounterComponent } from "src/components/CounterComponent/CounterComponent";
import { GridComponent } from "src/components/GridComponent/GridComponent";

export const LandingPage = () => {
  return (
    <>
      <CounterComponent />
      <TestComponent />
      <GridComponent />
    </>
  );
};
