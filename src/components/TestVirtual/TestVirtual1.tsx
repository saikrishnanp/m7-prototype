import { useState } from "react";

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

export const MyVirtualizedList1 = () => {
  const [dataToShow, setDataToShow] = useState<IDummyData[] | null>(data);

  const renderDone = () => {
    console.log(new Date(), "render done");

    return <></>;
  }

  return (
    <div
      style={{
        // height: '400px', // Adjust as needed
        width: "300px", // Adjust as needed
        overflow: "auto",
      }}
    >
      <div
        className="absolute top-0 cursor-pointer"
        onClick={() => {
          setDataToShow((prev) => {
            if (!prev) {
              console.log("setting");
              console.log(new Date());
              return data;
            }
            console.log("nulling");
            return null;
          });
        }}
      >
        Click me to toggle
      </div>
      <div
        style={{
          width: "100%",
          position: "relative",
        }}
      >
        {dataToShow &&
          dataToShow.map((item) => {
            return (
              <div
                key={item.id}
              >
                <span className="pr-4">{item.display}</span>
                <span className="pr-4">{item.value}</span>
                <input type="checkbox" checked={item.tooggledOn} readOnly />
              </div>
            );
          })}
      </div>
      {renderDone()}
    </div>
  );
};
