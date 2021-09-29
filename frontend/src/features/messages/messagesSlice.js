import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from "axios";

export var API_BASE = function() {
  if(window.location.hostname === "localhost") {
    return "http://localhost:5000/";
  } else {
    return "/"
  }
}

export const sendMessage = createAsyncThunk(
  'messages/send',
  async (item, thunkAPI) => {
    console.log("sending message");
    const response = await axios.post(API_BASE() + "api/messages", {
      message: item.message
    });
    console.log("message sent");
    return {
      sending: true
    }
  }
)

const messagesSlice = createSlice({
  name: 'messages',
  initialState: { 
    messages: [],
    loading: "",
    error: ""
  },
  reducers: {
    setMessage: (state, action) => {
      state.messages = [{
        message: action.payload.message,
        when: new Date().toUTCString()
      }].concat(state.messages);
    }
  },
  extraReducers: {
    [sendMessage.fulfilled]: (state, action) => {
      console.log("filled");
      state.loading = "idle";
      state.error = "";
    },
    [sendMessage.pending]: state => {
      state.loading = "yes";
    },
    [sendMessage.rejected]: (state, action) => {
      state.loading = "idle";
      state.error = action.error.message;
    },
  }
})

export const { setMessage } = messagesSlice.actions;

export const selectMessages = state => state.messages.messages;
export const selectLoading = state => state.messages.loading;
export const selectError = state => state.messages.error;

export default messagesSlice.reducer;