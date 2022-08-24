import { createReducer } from "@reduxjs/toolkit";
import { getUserDetails } from "../../Utils/userFunctions";
import { setCartWidgets, setIsEmailVerified, setisLoggedIn, setLoginErrMsg, setPurchasedWidgets, setUserDetails } from "./userAction";

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

let userObj = {
    isLoggedIn: LoginStatus(),
    loginErrMsg: "",
    username: "",
    firstname: "",
    lastname: "",
    accessToken: "",
    purchasedWidgets: [],
    cartWidgets: []
}

function LoginStatus(){
    if(LSAuth != undefined && LSAuth != null && JSON.parse(LSAuth).isLoggedIn == "true"){
        return true
    }
    else{
        return false
    }
}


const initialState = {
    userDetails : {
        isLoggedIn: LoginStatus(),
        loginErrMsg: "",
        username: "",
        firstname: "",
        lastname: "",
        isEmailVerified: false,
        accessToken: "",
        purchasedWidgets: [],
        cartWidgets: [],
        phoneNumber: 0,
        organization: ""
    }
}


export const userReducer = createReducer(initialState, (builder) => {

    builder.addCase(setUserDetails, (state, action) => ({...state, userDetails : action.payload}));

    builder.addCase(setisLoggedIn, (state, action) => ({...state, userDetails : {...state.userDetails, isLoggedIn : action.payload}}));

    builder.addCase(setLoginErrMsg, (state, action) => ({...state, userDetails : {...state.userDetails, loginErrMsg : action.payload}}));

    builder.addCase(setPurchasedWidgets, (state, action) => ({...state, userDetails : {...state.userDetails, purchasedWidgets : action.payload}}));

    builder.addCase(setCartWidgets, (state, action) => ({...state, userDetails : {...state.userDetails, cartWidgets : action.payload}}));

    builder.addCase(setIsEmailVerified, (state, action) => ({...state, userDetails : {...state.userDetails, isEmailVerified : action.payload}}));

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