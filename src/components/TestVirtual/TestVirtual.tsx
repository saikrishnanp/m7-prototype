import React, { useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface IDummyData {
  id: number;
  display: string;
  value: string;
  tooggledOn: boolean;
}

const data: IDummyData[] = Array.from({ length: 1000 }, (_, index) => ({
  id: index,
  display: `Item ${index}`,
  value: `Value ${index}`,
  tooggledOn: index % 2 === 0,
}));

export const MyVirtualizedList = () => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [dataToShow, setDataToShow] = useState<IDummyData[] | null>(data);

  const rowVirtualizer = useVirtualizer({
    count: dataToShow?.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: React.useCallback(() => 35, []), // Adjust based on your row height
    overscan: 5, // Render a few extra items above and below the viewport
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      style={{
        // height: '400px', // Adjust as needed
        width: '300px', // Adjust as needed
        overflow: 'auto',
      }}
    >
      <div 
        className="absolute top-0 cursor-pointer" 
        onClick={() => {
          setDataToShow((prev) => {
        if (!prev) {
          return data;
        }
        return null;
          });
        }}
      >
        Click me to toggle
      </div>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {dataToShow && virtualItems.map((virtualRow) => {
          const item = dataToShow[virtualRow.index];
          return (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
                height: `${virtualRow.size}px`,
                display: 'flex',
                alignItems: 'center',
                padding: '8px',
                borderBottom: '1px solid #eee',
              }}
            >
              <span className='pr-4'>{item.display}</span>
              <span className='pr-4'>{item.value}</span>
              <input type="checkbox" checked={item.tooggledOn} readOnly />
            </div>
          );
        })}
      </div>
    </div>
  );
};
