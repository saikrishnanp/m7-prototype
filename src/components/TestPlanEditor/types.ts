export enum TestStepActionEnum {
  FV = "FV",
  FI = "FI",
  MEASURE = "Measure",
  DELAY = "Delay",
}

export enum TestStepSubActionEnum {
  NORMAL = "Normal",
  FORCE = "Force",
  CLAMP = "Clamp",
}

export enum TestStepPinEnum {
  IN = "IN",
  OUT = "OUT",
  GND = "GND",
  VCC = "VCC",
}

export enum TestStepResourceEnum {
  SMPS = "SMPS",
  OSCILLATOR = "Oscillator",
}

export interface CommentStepType {
  id: string;
  comment: string;
  type: "comment";
}

export interface TestStepType {
  id: string;
  type: "test";
  action: TestStepActionEnum;
  subAction: TestStepSubActionEnum;
  pin: string;
  resource: string;
  nestedLevel: number;
  settings: string[];
  selected: boolean;
  errored: boolean;
}

export type TestStep = TestStepType | CommentStepType;

interface TestParameter {
  name: string;
  lowLimit: string;
  highLimit: string;
  unit: string;
}

interface TestInput {
  name: string;
  value: string;
}

export interface Test {
  testParameters: TestParameter[];
  testInputs: TestInput[];
  testSteps: TestStep[];
}

export interface TestStepBlock {
  id: string;
  test: Test;
}
