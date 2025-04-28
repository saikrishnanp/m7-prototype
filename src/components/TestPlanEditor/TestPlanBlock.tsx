import { v4 as uuid } from "uuid";
import { useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { VscodeButton } from "@vscode-elements/react-elements";

import { TestPlanRow } from "./TestplanRow";

import { isStepVisible, isTestStep } from "./utils";

import { TestStep, TestStepBlock } from "./types";

interface ITestPlanBlockProps {
  block: TestStepBlock;
  activeRows: TestStep[] | null;
  collapsedSteps: string[];
  rowIdToShowBorder: string | null;
  isFullScreen: boolean;
  handlePaste: (
    e: React.ClipboardEvent<HTMLDivElement>,
    blockId: string
  ) => void;
  handleAddRow: (
    blockId: string,
    stepData: TestStep | null,
    insertNextToRowId?: string | null
  ) => void;
  handleDeleteRow: (blockId: string, rowId: string) => void;
  handleDuplicateRow: (step: TestStep, blockId: string) => void;
  handleEditCell: (
    blockId: string,
    stepId: string,
    key: string,
    value: string | boolean
  ) => void;
  toggleCollapse: (stepId: string) => void;
  handleRowClick: (row: TestStep, e: React.MouseEvent) => void;
}

export const TestPlanBlock = ({
  block,
  activeRows,
  collapsedSteps,
  rowIdToShowBorder,
  isFullScreen,
  handlePaste,
  handleAddRow,
  handleDeleteRow,
  handleDuplicateRow,
  handleRowClick,
  handleEditCell,
  toggleCollapse,
}: ITestPlanBlockProps) => {
  const [showComments, toggleShowComments] = useState(false);

  const visibleSteps = block.test.testSteps.filter((step, index) =>
    isStepVisible(step, index, block.test.testSteps, collapsedSteps, showComments)
  );

  // Ref for the parent container
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: visibleSteps.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Height of each row
    overscan: 5, // Render extra rows for smoother scrolling
  });

  return (
    <SortableContext
      key={block.id}
      items={visibleSteps.map((step) => ('id' in step && step.id) ? step.id : uuid())}
      strategy={verticalListSortingStrategy}
    >
      <div
        className={clsx("border border-white rounded-md p-2 mb-2", {
          ["w-xl"]: !isFullScreen,
          ["w-full"]: isFullScreen,
        })}
        onPaste={(e) => handlePaste(e, block.id)}
      >
        <div className="flex justify-between items-center mb-2">
          <VscodeButton
            className="p-1 rounded-sm"
            type="button"
            onClick={() => handleAddRow(block.id, null)}
          >
            Add Row
          </VscodeButton>
          <button onClick={() => toggleShowComments(!showComments)}>{showComments ? "Hide " : "Show "}comments</button>
        </div>

        <div
          ref={parentRef}
          style={{
            height: "300px", // Adjust height based on your container
            overflowY: "auto", // Enable vertical scrolling
            overflowX: "hidden", // Prevent horizontal scrolling
          }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`, // Total height of the virtualized list
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const step = visibleSteps[virtualRow.index];

              const currentStepIndex = block.test.testSteps.findIndex(
                (s) => ('id' in s && s.id) === ('id' in step && step.id)
              );

              const nextStep: TestStep | undefined = block.test.testSteps[currentStepIndex + 1];
              const doesHaveNestedChildren =
                (isTestStep(nextStep) ? nextStep.nestedLevel : 0) >
                (isTestStep(step) ? step.nestedLevel : 0);

              const isActiveRow = activeRows
                ?.map((row) => row.id)
                .includes('id' in step ? step.id : '');
              const shouldShowBorderBottom = 'id' in step && rowIdToShowBorder === step.id;
              const isRowVisible = isStepVisible(
                step,
                virtualRow.index,
                block.test.testSteps,
                collapsedSteps,
                showComments
              );

              return (
                <div
                  key={'id' in step ? step.id : uuid()}
                  className={clsx("flex items-center", {
                    ["border-b border-amber-600"]: shouldShowBorderBottom,
                    ["hidden"]: !isRowVisible,
                  })}
                  style={{
                    position: "absolute",
                    top: `${virtualRow.start}px`,
                    left: 0,
                    width: "100%",
                  }}
                >
                  {doesHaveNestedChildren ? (
                    <div
                      className="cursor-pointer w-1.5 mr-1"
                      onClick={() => 'id' in step && toggleCollapse(step.id)}
                    >
                      {'id' in step && collapsedSteps.includes(step.id) ? <p>+</p> : <p>-</p>}
                    </div>
                  ) : (
                    <div className="w-1.5 mr-1" />
                  )}
                  <div
                    className={clsx({
                      ["border border-blue-700 rounded-lg"]: isActiveRow,
                    })}
                  >
                    <TestPlanRow
                      key={'id' in step ? step.id : uuid()}
                      step={step}
                      blockId={block.id}
                      isRowActive={Boolean(isActiveRow)}
                      handleDeleteRow={handleDeleteRow}
                      handleDuplicateRow={handleDuplicateRow}
                      handleEditCell={handleEditCell}
                      handleRowClick={handleRowClick}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SortableContext>
  );
};
