import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { backendPortURL} from "../../config";

// Fetch user details
export const fetchUserDetails = createAsyncThunk("currentUser/fetchUserDetails", async () => {
  axios.defaults.withCredentials = true;
  const response = await axios.get(`${backendPortURL}/user/me`);
  return response.data; // Axios automatically parses JSON
});

const userSlice = createSlice({
  name: "currentUser",
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.isLoading = true;
        state.isError = false; // Reset error state when fetching starts
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        console.error("Error:", action.error.message); // Log error details
        state.isLoading = false;
        state.isError = true;
        state.data = null
      });
  },
});

export default userSlice.reducer;