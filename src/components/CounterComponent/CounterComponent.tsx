import { useDispatch } from "react-redux";
import styles from "./CounterComponent.module.scss";
import { decrement, decrementByAmount, increment, incrementByAmount } from "src/redux/slices/counterSlice";

export const CounterComponent = () => {
  const dispatch = useDispatch();

  return (
    <div className={styles.card}>
      <button onClick={() => dispatch(increment())}>increment</button>
      <button onClick={() => dispatch(decrement())}>decrement</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>
        increment by 5
      </button>
      <button onClick={() => dispatch(decrementByAmount("5"))}>
        decrement by 5
      </button>
    </div>
  );
};
