import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import noteReducer from "./slices/noteSlice";

export const store = configureStore({
  reducer: {
    currentUser: userReducer,
    notes: noteReducer
  },
});