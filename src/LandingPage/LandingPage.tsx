// import { useState } from "react";
import styles from "./LandingPage.module.scss";

import { TestComponent } from "src/components/TestComponent/TestComponent";

import { useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount, decrementByAmount } from 'src/redux/slices/counterSlice';

export const LandingPage = () => {
  const dispatch = useDispatch();

  return (
    <>
      <div className={styles.card}>
        <button onClick={() => dispatch(increment())}>
          increment
        </button>
        <button onClick={() => dispatch(decrement())}>
          decrement
        </button>
        <button onClick={() => dispatch(incrementByAmount(5))}>
          increment by 5
        </button>
        <button onClick={() => dispatch(decrementByAmount("5"))}>
          decrement by 5
        </button>
      </div>
      <TestComponent />
    </>
  );
};
