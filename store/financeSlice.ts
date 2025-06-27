import { createSlice } from "@reduxjs/toolkit";

interface SomeState {
  value: number;
}

const initialState: SomeState = {
  value: 0,
};

const someSlice = createSlice({
  name: "financeFeature",
  initialState,
  reducers: {
    increment(state) {
      state.value += 1;
    },
    decrement(state) {
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = someSlice.actions;
export default someSlice.reducer;
