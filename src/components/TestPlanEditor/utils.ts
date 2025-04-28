import { CommentStepType, TestStep, TestStepBlock, TestStepType } from "./types";

export const findIndex = (
  steps: TestStep[],
  id: string
): number => {
  return steps.findIndex((step) => "id" in step && step.id === id);
};

export const findStepIndices = (
  stepsData: TestStepBlock[],
  activeId: string,
  overId: string
) => {
  let sourceBlock: TestStepBlock | undefined;
  let targetBlock: TestStepBlock | undefined;
  let activeStepIndex: number | undefined;
  let overStepIndex: number | undefined;

  stepsData.forEach((block) => {
    const activeIndex = findIndex(block.test.testSteps, activeId);
    const overIndex = findIndex(block.test.testSteps, overId);

    if (activeIndex !== -1) {
      sourceBlock = block;
      activeStepIndex = activeIndex;
    }

    if (overIndex !== -1) {
      targetBlock = block;
      overStepIndex = overIndex;
    }
  });

  return { sourceBlock, targetBlock, activeStepIndex, overStepIndex };
};

export const getMovedRowWithNestedLevel = (
  movedRow: TestStep,
  targetBlock: TestStepBlock,
  overStepIndex: number
) => {
  const previousStep = targetBlock.test.testSteps[overStepIndex - 1];
  
  const nestedLevel =
    overStepIndex - 1 >= 0
      ? (isTestStep(previousStep)
          ? previousStep.nestedLevel
          : 0)
      : 0;

  return { ...movedRow, nestedLevel };
};

export const isListOfTypeStep = (obj: unknown): obj is TestStep[] => {
  if (Array.isArray(obj)) {
    return obj.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "nestedLevel" in item
    );
  }

  return false;
};

export const isStepVisible = (
  step: TestStep,
  index: number,
  steps: TestStep[],
  collapsedSteps: string[],
  showComments: boolean
) => {
  console.log({currenStep: step, showComments, isCommentStep: isCommentStep(step)});
  if (isCommentStep(step) && showComments) {
    return true;
  }

  if (isCommentStep(step) && !showComments) {
    return false;
  }

  for (let i = index - 1; i >= 0; i--) {
    const currenStep = steps[i];


    if (isTestStep(step) && Boolean(step.nestedLevel) && isTestStep(currenStep) &&
      step.nestedLevel > currenStep.nestedLevel &&
      collapsedSteps.includes(currenStep.id)
    ) {
      return false;
    }
  }
  return true;
};

export const isTestStep = (step?: TestStep): step is TestStepType => {
  return step ? step.type === "test" : false;
};

export const isCommentStep = (step?: TestStep): step is CommentStepType => {
  return step ? step.type === "comment" : false;
};
