import { setCartWidgets, setisLoggedIn, setLoginErrMsg, setPurchasedWidgets, setUserDetails } from '../redux/UserRedux/userAction';
import store from '../redux/store';
import axios from 'axios';

export const setReduxUser = (username:any) => {
    return new Promise((res,rej) => {
        axios.get("http://localhost:5000/user/" + username)
        .then((user:any) => {
            let data = user.data;
            let details = {
                isLoggedIn: true,
                loginErrMsg: "",
                username: data?.username,
                firstname: data?.firstname,
                lastname: data?.lastname,
                isEmailVerified: data?.isEmailVerified,
                accessToken: data ? data?.accessToken : "",
                purchasedWidgets: data?.purchasedwidgets?.slice(),
                cartWidgets: data?.cartwidgets?.slice(),
                phoneNumber: data?.phoneNumber,
                organization: data?.organization
            }
            // store.dispatch(setUserDetails(details));
            res(details)
        })
    })
}

export const getUserDetails = (uname:any) => {
    return new Promise((res,rej) => {
        axios.get("http://localhost:5000/user/" + uname)
        .then((data:any) => {
            res(data.data)
        })
    })
}

export const logInUser = (username:any) => {
    // store.dispatch(setisLoggedIn(true));
    // window.location.href = "/";
    localStorage.setItem("auth", '{"isLoggedIn" : "true", "username" : "' + username +' "}');
};

export const logOutUser = () => {
    store.dispatch(setisLoggedIn(false));
    // window.location.href = "login";
    localStorage.setItem("auth", '{"isLoggedIn" : "false", "username" : ""}');
};

// function ab(){
//     return[setLoginErrMsg("Authenticated !"), setisLoggedIn(true)]
// }

const action1 = () => {
    return (dispatch:any) => {
      dispatch(setLoginErrMsg("Authenticated !"))
      dispatch(setisLoggedIn(true))
    }
  }

// export const ValidateUser = (uname:any, pswd:any) => {
//     // return new Promise((res,rej) => {
//         let isAuth:any;
//         let userObj = {
//             "username": uname,
//             "password": pswd
//         }
//         axios.post("http://localhost:5000/user/login", userObj)
//         .then((x:any) => {
//             isAuth = x.data.authenticated;
//             if(!isAuth){
//                 store.dispatch(setLoginErrMsg(x.data.errorMsg));
//                 localStorage.setItem("auth", '{"isLoggedIn" : "false", "username" : ""}');
//             }
//             else{
//                 setReduxUser(uname)
//                 .then(data => store.dispatch(setUserDetails(data)))
//                 // store.dispatch(setLoginErrMsg(x.data.errorMsg));
//                 localStorage.setItem("auth", '{"isLoggedIn" : "true", "username" : "' + uname +' "}');
//             }
//         })
//     // })

// }

// export const loginSeq = async (uname:any, pswd:any) => {
//     const a = ValidateUser
// }