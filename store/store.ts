import { configureStore } from "@reduxjs/toolkit";
import financeReducer from "./financeSlice";

export const store = configureStore({
  reducer: {
    financeFeature: financeReducer,
  },
});

// تایپ ریشه‌ی state برنامه
export type RootState = ReturnType<typeof store.getState>;

// تایپ Dispatch برنامه
export type AppDispatch = typeof store.dispatch;
