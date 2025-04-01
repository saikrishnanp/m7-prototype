import { TestPlanEditor } from "./TestPlanEditor";
import { InOrOutEnum, TestStepSection, TypeOfTestEnum } from "./types";

const testSteps: TestStepSection[] = [
  {
    id: "constant-data-test",
    descriptionPoints: ["Test that the data is constant"],
    steps: [
      {
        id: "1",
        name: "Step 1 - Constant Data",
        typeOfTest: TypeOfTestEnum.NORMAL,
        inOrOut: InOrOutEnum.INPUT,
        onOrOff: null,
        includedInDataSheet: true,
        nestedLevel: 0,
      },
      {
        id: "2",
        name: "Step 2",
        typeOfTest: TypeOfTestEnum.LOAD,
        inOrOut: InOrOutEnum.INPUT,
        onOrOff: true,
        includedInDataSheet: true,
        nestedLevel: 1,
      },
      {
        id: "2.1",
        name: "Step 2.1",
        typeOfTest: TypeOfTestEnum.LOAD,
        inOrOut: InOrOutEnum.INPUT,
        onOrOff: true,
        includedInDataSheet: true,
        nestedLevel: 1,
      },
      {
        id: "2.2",
        name: "Step 2.2",
        typeOfTest: TypeOfTestEnum.LOAD,
        inOrOut: InOrOutEnum.INPUT,
        onOrOff: true,
        includedInDataSheet: true,
        nestedLevel: 1,
      },
      {
        id: "2.3",
        name: "Step 2.3",
        typeOfTest: TypeOfTestEnum.LOAD,
        inOrOut: InOrOutEnum.INPUT,
        onOrOff: true,
        includedInDataSheet: false,
        nestedLevel: 2,
      },
      {
        id: "2.4",
        name: "Step 2.4",
        typeOfTest: TypeOfTestEnum.LOAD,
        inOrOut: InOrOutEnum.INPUT,
        onOrOff: true,
        includedInDataSheet: true,
        nestedLevel: 0,
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
        name: "Step 3003",
        typeOfTest: TypeOfTestEnum.NORMAL,
        inOrOut: InOrOutEnum.INPUT,
        onOrOff: null,
        includedInDataSheet: true,
        nestedLevel: 2,
      },
      {
        id: "4",
        name: "Step 4",
        typeOfTest: TypeOfTestEnum.NORMAL,
        inOrOut: InOrOutEnum.INPUT,
        onOrOff: true,
        includedInDataSheet: false,
        nestedLevel: 0,
      },
    ],
  },
];

export const TestPlanEditorPage = () => {
  return <TestPlanEditor testSteps={testSteps} />;
};
