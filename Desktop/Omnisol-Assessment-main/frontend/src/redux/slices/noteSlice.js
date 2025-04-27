import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { backendPortURL } from "../../config";

// Fetch user details
export const fetchNotes = createAsyncThunk("notes/fetchNotes", async (page = 0) => {
  axios.defaults.withCredentials = true;
  const response = await axios.get(`${backendPortURL}/api/notes?page=${page}`);
  return response.data; 
});

// Delete note
export const deleteNote = createAsyncThunk("notes/deleteNote", async (noteId) => {
  axios.defaults.withCredentials = true;
  const response = await axios.delete(`${backendPortURL}/api/notes/${noteId}`);
  return noteId; 
});


const noteSlice = createSlice({
  name: "notes",
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
    errorMessage: null, // Store error message for display
  },
  extraReducers: (builder) => {
    builder
      // Fetch notes actions
      .addCase(fetchNotes.pending, (state) => {
        state.isLoading = true;
        state.isError = false; // Reset error state when fetching starts
        state.errorMessage = null; // Reset error message
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        console.error("Error:", action.error.message); // Log error details
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
        state.data = null;
      })


      // Delete note actions
      .addCase(deleteNote.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove deleted note from the data array
        state.data = state.data.filter(note => note._id !== action.payload);
      })
      .addCase(deleteNote.rejected, (state, action) => {
        console.error("Delete Error:", action.error.message); // Log error details
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      })

  },
});

export default noteSlice.reducer;
