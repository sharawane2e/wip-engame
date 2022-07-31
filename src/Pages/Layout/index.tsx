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
  const checkLogin = useSelector((data:any) => data.user.isLoggedIn);

  const auth:any = (localStorage.getItem("auth"));

  // useEffect(() => {
  //   let authObj = JSON.parse(auth)
  //   if(authObj.isLogin == "true"){
  //     getUserDetails(authObj.username)
  //     .then((user:any) => {
  //         dispatch(setUserDetails(user.data))
  //     })
  //   }
  // },[])

  const ab = {
    isLoggedIn: false,
    username: "gaurav",
    firstname: "gg",
    lastname: "ss",
    purchasedWidgets: [],
    cartWidgets: []
}

  useEffect(() => {
    // ApiRequest("user/login", "POST", {
    //   "username" : "gaurav",
    //   "password": "hi"
    // })
    // .then(x => console.log(x))
  
  }, [])

  // useEffect(() => {
  //   if(checkLogin == false){
  //     navigate("/login");
  //   }
  // },[checkLogin])

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