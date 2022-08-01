import React, { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom';
import CardsContainer from '../../Components/CardsContainer';
import TopNav from '../../Components/TopNavBar';
import CartPage from '../CartPage';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';
import { ApiRequest } from '../../Utils/helperFunctions';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, setReduxUser } from '../../Utils/userFunctions';
import { setUserDetails } from '../../redux/UserRedux/userAction';
import axios from 'axios';
import MyWidgetsPage from '../MyWidgetsPage';

function Layout() {

  const dispatch = useDispatch();
  let navigate = useNavigate();
  const storeData = useSelector((data:any) => data);

  const auth:any = (localStorage.getItem("auth"));
  const username = JSON.parse(auth).username;

  let userObj = {
    isLoggedIn: true,
    loginErrMsg: "",
    username: "",
    firstname: "",
    lastname: "",
    accessToken: "",
    purchasedWidgets: [],
    cartWidgets: []
  }

  function returnUserDetails(){
    let login = JSON.parse(auth).isLoggedIn;
    if(storeData?.user?.userDetails?.isLoggedIn){
        getUserDetails(username)
        .then((data:any) => {
            let obj = JSON.parse(JSON.stringify(userObj));
            obj.userObj = true;
            obj.username = data.username;
            obj.firstname = data.firstname;
            obj.lastname = data.lastname;
            obj.accessToken = data.accessToken;
            obj.purchasedWidgets = data.purchasedwidgets;
            obj.cartWidgets = data.cartwidgets;
            return obj;
        })
    }
    else{
      let a = storeData?.user?.userDetails;
        return a;
    }
  }

  const ab = {
    isLoggedIn: false,
    username: "gaurav",
    firstname: "gg",
    lastname: "ss",
    purchasedWidgets: [],
    cartWidgets: []
  }

  return (
    <>
        <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
          <TopNav/>
          <Routes>
              <Route path="/" element={<CardsContainer/>} />
              <Route path="cart" element={<CartPage/>} />
              <Route path="mywidgets" element={<MyWidgetsPage/>} />
          </Routes>
        </SnackbarProvider>
    </>
  )
}

export default Layout;