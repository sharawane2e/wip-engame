import { createReducer } from "@reduxjs/toolkit";
import { setCartWidgets, setisLoggedIn, setLoginErrMsg, setPurchasedWidgets, setUserDetails } from "./userAction";

// const initialState = {
//     isLoggedIn: false,
//     loginErrMsg: "",
//     userDetails : {
//         username: "",
//         firstname: "",
//         lastname: "",
//     },
//     purchasedWidgets: [],
//     cartWidgets: [],
// }

let LSAuth:any = localStorage.getItem("auth");


const initialState = {
    userDetails : {
        isLoggedIn: false,
        loginErrMsg: "",
        username: JSON.parse(LSAuth).username,
        firstname: "",
        lastname: "",
        accessToken: "",
        purchasedWidgets: [],
        cartWidgets: []
    }
}


export const userReducer = createReducer(initialState, (builder) => {

    builder.addCase(setUserDetails, (state, action) => ({...state, userDetails : action.payload}));

    builder.addCase(setisLoggedIn, (state, action) => ({...state, userDetails : {...state.userDetails, isLoggedIn : action.payload}}));

    builder.addCase(setLoginErrMsg, (state, action) => ({...state, userDetails : {...state.userDetails, loginErrMsg : action.payload}}));

    builder.addCase(setPurchasedWidgets, (state, action) => ({...state, userDetails : {...state.userDetails, purchasedWidgets : action.payload}}));

    builder.addCase(setCartWidgets, (state, action) => ({...state, userDetails : {...state.userDetails, cartWidgets : action.payload}}));

});

// export const userReducer = (state = { userData: initialState }, action:any) => {
//     switch (action.type) {
  
//         case "LOGIN_SUCCESS":
//             return { ...state, userData: [{...state.userData}, action.payload] };

//         case "LOGOUT":
//             return { userData: action.payload };

//         case "SET_USERNAME":
//             return { userData: action.payload };

//         default:
//             return state;
//     }
// };