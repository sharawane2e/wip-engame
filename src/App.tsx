import React, { useEffect } from 'react';
import './App.css';
import CardsContainer from './Components/CardsContainer';
import { Navigate, Route, Routes } from 'react-router-dom';
import CartPage from './Pages/CartPage';
import LoginPage from './Pages/LoginPage';
import Layout from './Pages/Layout';
import MyWidgetsPage from './Pages/MyWidgetsPage';
import { useSelector } from 'react-redux';

function App() {

  const auth:any = (localStorage.getItem("auth"));
  const storeData = useSelector((data:any) => data);

  function PrivateRoute({ children }:any) {
    let isLogin = storeData?.user?.userDetails?.isLoggedIn;
    let isLoggedIn = JSON.parse(auth).isLoggedIn;
    if(isLogin != undefined && isLogin == true){
      return children
    }
    else{
      return <Navigate to="/login" />
    }
    // return isLogin && isLogin == true ? children : <Navigate to="/login" />;
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
  );
}

export default App;
