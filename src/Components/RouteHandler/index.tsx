import { ContactPage } from '@mui/icons-material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes, useRoutes } from 'react-router-dom';
import CartPage from '../../Pages/CartPage';
import ContactUsPage from '../../Pages/InfoPages/ContactUsPage';
import Layout from '../../Pages/Layout';
import LoginPage from '../../Pages/LoginPage';
import MyWidgets from '../../Pages/MyWidgets';
import MyWidgetsPage from '../../Pages/MyWidgetsPage';
import PageNotFound from '../../Pages/PageNotFound';
import ProfilePage from '../../Pages/ProfilePage';
import { setUserDetails } from '../../redux/UserRedux/userAction';
import { setReduxUser } from '../../Utils/userFunctions';
import CardsContainer from '../CardsContainer';
import Cart from '../Cart';

const RouteHandler = () => {

  const auth:any = (localStorage.getItem("auth"));
  const storeData = useSelector((data:any) => data);
  const localUsername = JSON.parse(auth)?.username;
  const dispatch = useDispatch();
  let isLoggedIn = JSON.parse(auth)?.isLoggedIn;

  useEffect(() => {
    let isLogin = storeData?.user?.userDetails?.isLoggedIn;
    if(isLogin != undefined && isLogin == true){
      setReduxUser(localUsername)
      .then((data:any) => dispatch(setUserDetails(data)))
    }
  },[]);

  function PrivateRoute({ children }:any) {
    let isLogin = storeData?.user?.userDetails?.isLoggedIn;
    let isLoggedIn = JSON.parse(auth)?.isLoggedIn;
    if(isLogin != undefined && isLogin == true){
      return children
    }
    else{
      // return <Navigate to="/login" />
    }
  }

  const routes = (isLoggedIn:any) => [
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '/#', element: <CardsContainer /> },
        { path: '/cart', element: isLoggedIn == "true" ? <Cart /> : <Navigate to="/"/> },
        { path: '/mywidgets', element: <MyWidgets /> },
        { path: '/profile', element: <ProfilePage /> }
      ],
    }
  ];

  const routing = useRoutes(routes(isLoggedIn));

  return (
      <>
        {/* {routing} */}
        <Routes>
          <Route path="*" element={<PageNotFound/>} />
          <Route path="/" element={<Layout/>}>
              <Route index element={<CardsContainer/>} />
              <Route path="cart" element={<CartPage/>} />
              <Route path="mywidgets" element={<MyWidgetsPage/>} />
              <Route path="profile" element={<ProfilePage/>} />
              <Route path="contact-us" element={<ContactUsPage/>} />
          </Route>
        </Routes>
      </>
  )
}

export default RouteHandler