// import styles from './TestComponent.module.scss';

import { useSelector } from "react-redux";
import { RootState } from "src/redux/store";

export const TestComponent = () => {
  const count = useSelector((state: RootState) => state.counter.value);

  console.log(count, 'render');
  return <div>test count! - {count}</div>;
};
