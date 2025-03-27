export enum StepsEnum {
  Step1 = "Step 1",
  Step2 = "Step 2",
  Step3 = "Step 3",
  Step4 = "Step 4",
}

export enum TypeOfTestEnum {
  NORMAL = "Normal",
  LOAD = "Load",
}

export enum InOrOutEnum {
  INPUT = "Input",
  OUTPUT = "Output",
}

export enum OnOrOffEnum {
  ON = "On",
  OFF = "Off",
}

export interface Step {
  id: string;
  name: string;
  typeOfTest: TypeOfTestEnum;
  inOrOut: InOrOutEnum;
  onOrOff: OnOrOffEnum | null;
  includedInDataSheet: boolean;
}

export interface TestStepSection {
  id: string;
  descriptionPoints: string[];
  steps: Step[];
}