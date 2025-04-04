import { TestPlanEditor } from "./TestPlanEditor";
import { InOrOutEnum, TestStepSection, TypeOfTestEnum } from "./types";

const dummySteps = new Array(1000).fill(null).map((_, index) => ({
  id: String(index),
  name: `Step ${index++}`,
  typeOfTest: index%3==0 ? TypeOfTestEnum.NORMAL : TypeOfTestEnum.LOAD,
  inOrOut: InOrOutEnum.INPUT,
  onOrOff: index%2==0,
  includedInDataSheet: index%4==0,
  nestedLevel: 0,
}));

const testSteps: TestStepSection[] = [
  {
    id: "constant-data-test",
    descriptionPoints: ["Test that the data is constant"],
    steps: [
      {
        id: "1.1",
        name: "Step 1 - Constant Data",
        typeOfTest: TypeOfTestEnum.NORMAL,
        inOrOut: InOrOutEnum.INPUT,
        onOrOff: null,
        includedInDataSheet: true,
        nestedLevel: 0,
      },
      {
        id: "2.1",
        name: "Step 2 - CD",
        typeOfTest: TypeOfTestEnum.LOAD,
        inOrOut: InOrOutEnum.INPUT,
        onOrOff: true,
        includedInDataSheet: true,
        nestedLevel: 1,
      },
      {
        id: "2.1cd",
        name: "Step 2.1 - CD",
        typeOfTest: TypeOfTestEnum.LOAD,
        inOrOut: InOrOutEnum.INPUT,
        onOrOff: true,
        includedInDataSheet: true,
        nestedLevel: 2,
      },
      {
        id: "2.2cd",
        name: "Step 2.2 - CD",
        typeOfTest: TypeOfTestEnum.LOAD,
        inOrOut: InOrOutEnum.INPUT,
        onOrOff: true,
        includedInDataSheet: true,
        nestedLevel: 1,
      }
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
        id: "3cd",
        name: "Step 3003",
        typeOfTest: TypeOfTestEnum.NORMAL,
        inOrOut: InOrOutEnum.INPUT,
        onOrOff: null,
        includedInDataSheet: true,
        nestedLevel: 2,
      },
      {
        id: "4cd",
        name: "Step 4",
        typeOfTest: TypeOfTestEnum.NORMAL,
        inOrOut: InOrOutEnum.INPUT,
        onOrOff: true,
        includedInDataSheet: false,
        nestedLevel: 0,
      },
      ...dummySteps
    ],
  },
];

export const TestPlanEditorPage = () => {
  return <TestPlanEditor testSteps={testSteps} />;
};
