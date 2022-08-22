import { createReducer } from "@reduxjs/toolkit";
import { setEmailDetails } from "./emailAction";

const initialState = {
  emailDetails: {
    isEmailRedirect: false,
    accessToken: ""
  }
}

export const emailReducer = createReducer(initialState, (builder) => {

  builder.addCase(setEmailDetails, (state, action) => ({...state, emailDetails : action.payload}));

});