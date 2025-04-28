import { v4 as uuid } from "uuid";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  TestStep,
  TestStepActionEnum,
  TestStepBlock,
  TestStepPinEnum,
  TestStepResourceEnum,
  TestStepSubActionEnum,
} from "src/components/TestPlanEditor/types";
import {
  findStepIndices,
  getMovedRowWithNestedLevel,
  isTestStep,
} from "src/components/TestPlanEditor/utils";

const placeHolderStep: TestStep = {
  id: uuid(),
  type: "test",
  action: TestStepActionEnum.FV,
  subAction: TestStepSubActionEnum.NORMAL,
  pin: "pin1",
  resource: "resource",
  nestedLevel: 0,
  settings: [],
  selected: false,
  errored: false,
};

const initialState: TestStepBlock[] = [
  {
    id: "block-1",
    test: {
      testParameters: [
        {
          name: "Output Voltage",
          lowLimit: "4.8",
          highLimit: "5.2",
          unit: "V",
        },
        {
          name: "Load Current",
          lowLimit: "0.5",
          highLimit: "2.0",
          unit: "A",
        },
      ],
      testInputs: [
        {
          name: "Input Voltage",
          value: "12V",
        },
        {
          name: "Frequency",
          value: "50Hz",
        },
      ],
      testSteps: [
        {
          id: "test-step-1",
          type: "test",
          action: TestStepActionEnum.FV,
          subAction: TestStepSubActionEnum.NORMAL,
          pin: TestStepPinEnum.IN,
          resource: TestStepResourceEnum.SMPS,
          nestedLevel: 0,
          settings: ["Enable", "Set Voltage to 12V"],
          selected: true,
          errored: false,
        },
        {
          id: "test-step-2",
          type: "test",
          action: TestStepActionEnum.MEASURE,
          subAction: TestStepSubActionEnum.FORCE,
          pin: TestStepPinEnum.OUT,
          resource: TestStepResourceEnum.OSCILLATOR,
          nestedLevel: 1,
          settings: ["Measure Output Voltage"],
          selected: false,
          errored: false,
        },
        {
          id: "test-step-1-comment",
          type: "comment",
          comment: "Ensure the output voltage is stable before proceeding.",
        },
        {
          id: "test-step-2-comment",
          type: "comment",
          comment: "Ensure the input voltage is stable before proceeding.",
        },
        {
          id: "test-step-3",
          type: "test",
          action: TestStepActionEnum.MEASURE,
          subAction: TestStepSubActionEnum.FORCE,
          pin: TestStepPinEnum.OUT,
          resource: TestStepResourceEnum.OSCILLATOR,
          nestedLevel: 1,
          settings: ["Measure Input Voltage", "Check for noise"],
          selected: false,
          errored: false,
        },
        {
          id: "test-step-4",
          type: "test",
          action: TestStepActionEnum.MEASURE,
          subAction: TestStepSubActionEnum.FORCE,
          pin: TestStepPinEnum.OUT,
          resource: TestStepResourceEnum.OSCILLATOR,
          nestedLevel: 2,
          settings: ["Measure Input Voltage", "Check for noise"],
          selected: false,
          errored: false,
        },
        {
          id: "test-step-5",
          type: "test",
          action: TestStepActionEnum.MEASURE,
          subAction: TestStepSubActionEnum.FORCE,
          pin: TestStepPinEnum.OUT,
          resource: TestStepResourceEnum.OSCILLATOR,
          nestedLevel: 2,
          settings: ["Measure Input Voltage", "Check for noise"],
          selected: false,
          errored: false,
        },
        {
          id: "test-step-6",
          type: "test",
          action: TestStepActionEnum.MEASURE,
          subAction: TestStepSubActionEnum.FORCE,
          pin: TestStepPinEnum.OUT,
          resource: TestStepResourceEnum.OSCILLATOR,
          nestedLevel: 0,
          settings: ["Measure Input Voltage", "Check for noise"],
          selected: false,
          errored: false,
        },
      ],
    },
  },
];

const testStepsSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    deleteStep: (
      state,
      action: PayloadAction<{ sectionId: string; rowId: string }>
    ) => {
      const { sectionId, rowId } = action.payload;

      return state.map((block) =>
        block.id === sectionId
          ? {
              ...block,
              test: {
                ...block.test,
                testSteps: block.test.testSteps.filter(
                  (step) => step.id !== rowId
                ),
              },
            }
          : block
      );
    },
    addStepToSection: (
      state,
      action: PayloadAction<{
        sectionId: string;
        stepData: TestStep | null;
        insertNextToRowId: string | null;
      }>
    ) => {
      const { sectionId, stepData, insertNextToRowId } = action.payload;

      const stepToAdd = stepData ?? {
        ...placeHolderStep,
        id: uuid(),
      };

      const block = state.find((block) => block.id === sectionId);
      if (block) {
        const activeRowIndex = block.test.testSteps.findIndex(
          (step) => step.id === insertNextToRowId
        );

        if (activeRowIndex !== -1) {
          const previousStep = block.test.testSteps[activeRowIndex];
          const nestedLevel = isTestStep(previousStep)
            ? previousStep.nestedLevel
            : 0;

          if (isTestStep(stepToAdd)) {
            block.test.testSteps.splice(activeRowIndex + 1, 0, {
              ...stepToAdd,
              nestedLevel,
            });
          } else {
            block.test.testSteps.splice(activeRowIndex + 1, 0, stepToAdd);
          }
        } else {
          block.test.testSteps.push(stepToAdd);
        }
      }
    },
    editStep: (
      state,
      action: PayloadAction<{
        sectionId: string;
        rowId: string;
        key: string;
        value: string | boolean;
      }>
    ) => {
      const { sectionId, rowId, key, value } = action.payload;

      return state.map((block) =>
        block.id === sectionId
          ? {
              ...block,
              test: {
                ...block.test,
                testSteps: block.test.testSteps.map((step) =>
                  step.id === rowId ? { ...step, [key]: value } : step
                ),
              },
            }
          : block
      );
    },
    moveStep: (
      state,
      action: PayloadAction<{
        activeId: string;
        overId: string;
      }>
    ) => {
      const { activeId, overId } = action.payload;

      const { sourceBlock, targetBlock, activeStepIndex, overStepIndex } =
        findStepIndices(state, activeId, overId);

      if (
        !sourceBlock ||
        !targetBlock ||
        activeStepIndex === undefined ||
        overStepIndex === undefined
      ) {
        return state;
      }

      const [movedRow] = sourceBlock.test.testSteps.splice(activeStepIndex, 1);

      const updatedOverStepIdx =
        sourceBlock.id === targetBlock.id ? overStepIndex : overStepIndex + 1;

      const movedRowWithNestedLevel = getMovedRowWithNestedLevel(
        movedRow,
        targetBlock,
        updatedOverStepIdx
      );

      targetBlock.test.testSteps.splice(
        updatedOverStepIdx,
        0,
        movedRowWithNestedLevel
      );

      return state;
    },
  },
});

export const { deleteStep, addStepToSection, editStep, moveStep } =
  testStepsSlice.actions;

export default testStepsSlice.reducer;
