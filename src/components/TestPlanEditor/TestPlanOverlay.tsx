import { DragOverlay } from "@dnd-kit/core";

import { TestPlanRow } from "./TestplanRow";
import { TestStep } from "./types";

interface ITestPlanOverlayProps {
  draggedItem: TestStep | null;
}

export const TestPlanOverlay = ({ draggedItem }: ITestPlanOverlayProps) => {
  return (
    <DragOverlay>
      {draggedItem && (
        <TestPlanRow
          isRowActive={false}
          step={draggedItem}
          blockId={draggedItem.id}
          handleDeleteRow={() => {}}
          handleDuplicateRow={() => {}}
          handleEditCell={() => {}}
          handleRowClick={() => {}}
        />
      )}
    </DragOverlay>
  );
};
