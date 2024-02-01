import { createSlice } from "@reduxjs/toolkit";
import { startTransition } from "react";
import { act } from "react-dom/test-utils";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const UserSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    signinStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    UpdateUserStart: (state, action) => {
      state.loading = true;
    },
    UpdateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    UpdateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    DeleteUserStart: (state, action) => {
      state.loading = true;
    },
    DeleteUserSuccess: (state, action) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    DeleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.currentUser = null;
    },
    SignOutUserStart: (state, action) => {
      state.loading = true;
    },
    SignOutUserSuccess: (state, action) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    SignOutUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.currentUser = null;
    },
  },
});

export const {
  signinStart,
  signInSuccess,
  signInFailure,
  UpdateUserStart,
  DeleteUserStart,
  DeleteUserSuccess,
  DeleteUserFailure,
  UpdateUserSuccess,
  UpdateUserFailure,
  SignOutUserStart,
  SignOutUserSuccess,
  SignOutUserFailure,
} = UserSlice.actions;

export default UserSlice.reducer;
