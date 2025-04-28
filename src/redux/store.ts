import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
import userReducer from './slices/userSlice';
import testStepsReducer from './slices/testStepsSlice';

const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    testSteps: testStepsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;