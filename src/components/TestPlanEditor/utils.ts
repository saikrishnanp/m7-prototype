import { Step, TestStepSection } from "./types";

export const findIndex = <T extends {id: string}>(
  steps: T[],
  id: string
): number => {
  return steps.findIndex(
    (step) => step.id === id
  );
}

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