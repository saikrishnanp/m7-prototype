import { v4 as uuid } from "uuid";

import { InOrOutEnum, Step, TestStepSection, TypeOfTestEnum } from "./types";

export const findIndex = <T extends { id: string }>(
  steps: T[],
  id: string
): number => {
  return steps.findIndex((step) => step.id === id);
};

export const findStepIndices = (
  stepsData: TestStepSection[],
  activeId: string,
  overId: string
) => {
  let sourceSection: TestStepSection | undefined;
  let targetSection: TestStepSection | undefined;
  let activeStepIndex: number | undefined;
  let overStepIndex: number | undefined;

  stepsData.forEach((section) => {
    const activeIndex = findIndex(section.steps, activeId);
    const overIndex = findIndex(section.steps, overId);

    if (activeIndex !== -1) {
      sourceSection = section;
      activeStepIndex = activeIndex;
    }

    if (overIndex !== -1) {
      targetSection = section;
      overStepIndex = overIndex;
    }
  });

  return { sourceSection, targetSection, activeStepIndex, overStepIndex };
};

export const getMovedRowWithNestedLevel = (
  movedRow: Step,
  targetSection: TestStepSection,
  overStepIndex: number
) => {
  const nestedLevel =
    overStepIndex - 1 >= 0
      ? targetSection.steps[overStepIndex - 1].nestedLevel
      : 0;

  return { ...movedRow, nestedLevel };
};

export const isListOfTypeStep = (obj: unknown): obj is Step[] => {
  if (Array.isArray(obj)) {
    return obj.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "name" in item &&
        "typeOfTest" in item &&
        "inOrOut" in item &&
        "onOrOff" in item &&
        "includedInDataSheet" in item &&
        "nestedLevel" in item
    );
  }

  return false;
};

export const moveRow = (
  stepsData: TestStepSection[],
  activeId: string,
  overId: string
): TestStepSection[] => {
  const updatedSteps = [...stepsData];

  const { sourceSection, targetSection, activeStepIndex, overStepIndex } =
    findStepIndices(updatedSteps, activeId, overId);

  if (
    !sourceSection ||
    !targetSection ||
    activeStepIndex === undefined ||
    overStepIndex === undefined
  ) {
    return stepsData;
  }

  const [movedRow] = sourceSection.steps.splice(activeStepIndex, 1);

  const updatedOverStepIdx =
    sourceSection.id === targetSection.id ? overStepIndex : overStepIndex + 1;

  const movedRowWithNestedLevel = getMovedRowWithNestedLevel(
    movedRow,
    targetSection,
    updatedOverStepIdx
  );

  targetSection.steps.splice(updatedOverStepIdx, 0, movedRowWithNestedLevel);

  return updatedSteps;
};

export const addRowToSection = (
  stepsData: TestStepSection[],
  sectionId: string,
  stepData: Step | null,
  insertNextToRowId: string | null
): TestStepSection[] => {
  const newStepData = stepData ?? {
    id: uuid(),
    name: "New Step",
    typeOfTest: TypeOfTestEnum.NORMAL,
    inOrOut: InOrOutEnum.INPUT,
    onOrOff: false,
    includedInDataSheet: true,
    nestedLevel: 0,
  };

  return stepsData.map((section) => {
    if (section.id === sectionId) {
      const activeRowIndex = section.steps.findIndex(
        (step) => step.id === insertNextToRowId
      );

      if (activeRowIndex !== -1) {
        const updatedSteps = [...section.steps];
        const previousStep = updatedSteps[activeRowIndex];
        const nestedLevel = previousStep.nestedLevel;

        updatedSteps.splice(activeRowIndex + 1, 0, {
          ...newStepData,
          nestedLevel,
        });

        return {
          ...section,
          steps: updatedSteps,
        };
      }

      return {
        ...section,
        steps: [...section.steps, newStepData],
      };
    }
    return section;
  });
};

export const isStepVisible = (
  step: Step,
  index: number,
  steps: Step[],
  collapsedSteps: string[]
) => {
  for (let i = index - 1; i >= 0; i--) {
    if (
      step.nestedLevel > steps[i].nestedLevel &&
      collapsedSteps.includes(steps[i].id)
    ) {
      return false;
    }
  }
  return true;
};
