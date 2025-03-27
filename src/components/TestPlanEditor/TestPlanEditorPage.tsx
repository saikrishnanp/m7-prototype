import { TestPlanEditor } from "./TestPlanEditor";
import { InOrOutEnum, OnOrOffEnum, TypeOfTestEnum } from "./types";

const testSteps = [
  {
    id: "constant-data-test",
    descriptionPoints: ["Test that the data is constant"],
    steps: [
      {
        id: "1",
        name: "Step 1",
        typeOfTest: TypeOfTestEnum.NORMAL,
        inOrOut: InOrOutEnum.INPUT,
        onOrOff: null,
        includedInDataSheet: true,
      },
      {
        id: "2",
        name: "Step 2",
        typeOfTest: TypeOfTestEnum.NORMAL,
        inOrOut: InOrOutEnum.INPUT,
        onOrOff: OnOrOffEnum.ON,
        includedInDataSheet: true,
      },
    ],
  },
  {
    id: "variable-data-test",
    descriptionPoints: [
      "Test that the data is variable",
      "This will act as the load test",
    ],
    steps: [
      {
        id: "3",
        name: "Step 3",
        typeOfTest: TypeOfTestEnum.NORMAL,
        inOrOut: InOrOutEnum.INPUT,
        onOrOff: null,
        includedInDataSheet: true,
      },
      {
        id: "4",
        name: "Step 4",
        typeOfTest: TypeOfTestEnum.NORMAL,
        inOrOut: InOrOutEnum.INPUT,
        onOrOff: OnOrOffEnum.ON,
        includedInDataSheet: false,
      },
    ],
  },
];

export const TestPlanEditorPage = () => {
  return <TestPlanEditor initialTestSteps={testSteps} />;
};
