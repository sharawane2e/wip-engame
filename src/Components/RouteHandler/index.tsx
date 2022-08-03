import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import CartPage from '../../Pages/CartPage';
import Layout from '../../Pages/Layout';
import LoginPage from '../../Pages/LoginPage';
import MyWidgetsPage from '../../Pages/MyWidgetsPage';
import { setUserDetails } from '../../redux/UserRedux/userAction';
import { setReduxUser } from '../../Utils/userFunctions';
import CardsContainer from '../CardsContainer';

function RouteHandler() {

    const auth:any = (localStorage.getItem("auth"));
    const storeData = useSelector((data:any) => data);
    const localUsername = JSON.parse(auth)?.username;
    const dispatch = useDispatch();

    useEffect(() => {
      let isLogin = storeData?.user?.userDetails?.isLoggedIn;
      if(isLogin != undefined && isLogin == true){
        setReduxUser(localUsername)
        .then((data:any) => dispatch(setUserDetails(data)))
      }
    },[])
  
    function PrivateRoute({ children }:any) {
      let isLogin = storeData?.user?.userDetails?.isLoggedIn;
      let isLoggedIn = JSON.parse(auth)?.isLoggedIn;

      console.log("localUsername",localUsername)

      if(isLogin != undefined && isLogin == true){
        // setReduxUser(localUsername)
        // .then((data:any) => dispatch(setUserDetails(data)))
        return children
      }
      else{
        return <Navigate to="/login" />
      }
    }

    return (
        <>
            <Routes>
                <Route path="/login" element={<LoginPage/>} />

                <Route path="/" element={<PrivateRoute><Layout/></PrivateRoute>}>
                    <Route index element={<CardsContainer/>} />
                    <Route path="cart" element={<CartPage/>} />
                    <Route path="mywidgets" element={<MyWidgetsPage/>} />
                </Route>

            </Routes>
        </>
    )
}

export default RouteHandler