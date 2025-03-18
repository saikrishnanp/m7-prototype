import { createSlice } from '@reduxjs/toolkit';

export interface IUserState {
  name: string;
  age: number;
}

const initialState: IUserState = { name: 'John Doe', age: 23 };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setName: (state, action) => {
      console.log('action', action, "username set");
      state.name = action.payload;
    },
    setAge: (state, action) => {
      state.age = action.payload;
    },
  },
});

export const { setName, setAge } = userSlice.actions;
export default userSlice.reducer;