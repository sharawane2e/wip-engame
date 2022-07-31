import { setUserDetails } from '../redux/UserRedux/userAction';
import store from '../redux/store';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const AddtoCartHelper = (widObj:any, storeData:any) => {
    return new Promise((res,rej) => {
        axios.patch("http://localhost:5000/user/addtocart",widObj)
        .then((x:any) => {
            console.log("added", x.data)
            res(x.data);
            // store.dispatch(setUserDetails(storeData.user.userDetails.username))
        })
    })
};

export type Todo = {
    widObj: any;
  };

export const ATCHelper = createAsyncThunk<Todo[]>("setUserDetails", 
    async (widObj:any) => {
        return new Promise((res,rej) => {
            axios.patch("http://localhost:5000/user/addtocart",widObj)
            .then((x:any) => {
                console.log("added", x.data)
            })
        })
    }
)



export const getAllWidgets = () => {
    return new Promise((resolve:any,rej:any) => {
        axios.get("http://localhost:5000/products")
        .then(x => {
            resolve(x.data);
        });
    })
}

export const subsStatement = (details:any) => {
    let str:string = ""
    if(details?.subs_type == "Hits"){
        str = "Subscription for " + details?.total_count + " hits";
    }
    else{
        str = "Subscription for " + details?.total_count + " days";
    }
    return str;
}

// const populateCart2 = () => {
//     let arr:any = [];
//     let dbArr = setReduxUser();
//     if(dbArr?.length > 0){
//         dbArr.map((wid:any) => {
//             getAllWidgets().then((aw:any) => {
//                 let obj = aw.filter((x:any) => x.id == wid.id)[0];
//                 arr.push(obj);
//             });
//         })
//         setWidgitArr(arr);
//     }
//     else{
//         setCartEmptyMsg("Cart is empty !")
//     }
//     console.log(arr)
// }