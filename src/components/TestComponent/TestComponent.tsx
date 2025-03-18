import styles from "./TestComponent.module.scss";

import { useSelector } from "react-redux";
import { RootState } from "src/redux/store";

export const TestComponent = () => {
  const count = useSelector((state: RootState) => state.counter.value);

  console.log(count, "render");
  return (
    <>
      <div
        className={`font-bold underline shadow-xl shadow-fuchsia-400/95 ${styles.countContainer} dark:bg-amber-200 md:flex sm:grid space-x-4`}
      >
        test count: {count}
      </div>
      <div className="space-y-10 flex flex-col items-center justify-center">
        <button className="divide-zinc-300 w-fit">B1</button>
        <button className="divide-zinc-300 w-fit">B1</button>
        <button className="divide-zinc-300 w-fit">B1</button>
      </div>
    </>
  );
};
