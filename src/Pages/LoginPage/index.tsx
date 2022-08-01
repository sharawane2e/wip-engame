import React, { useEffect, useState } from 'react';
import "./Login.scss";
import logoimg from "../../Assets/Engame_logo.svg";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { setReduxUser } from '../../Utils/userFunctions';
import { useDispatch, useSelector } from 'react-redux';
import { setLoginErrMsg, setUserDetails } from '../../redux/UserRedux/userAction';
import store from '../../redux/store';

function LoginPage() {

  const [errorMsg, setErrorMsg] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const storeData = useSelector((data:any) => data);
  let navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let details = {
      isLoggedIn: false,
      loginErrMsg: "",
      username: "",
      firstname: "",
      lastname: "",
      accessToken: "",
      purchasedWidgets: [],
      cartWidgets: []
  }
  dispatch(setUserDetails(details));
  }, [])

  const ValidateUser = (uname:any, pswd:any) => {
    let isAuth:any;
    let userObj = {
      "username": uname,
      "password": pswd
    }
    axios.post("http://localhost:5000/user/login", userObj)
    .then((x:any) => {
      console.log(x.data)
      isAuth = x.data.authenticated;
      if(!isAuth){
        dispatch(setLoginErrMsg(x.data.errorMsg));
        localStorage.setItem("auth", '{"isLoggedIn" : "false", "username" : ""}');
      }
      else{
        setReduxUser(username)
        .then(data => {
          dispatch(setUserDetails(data))
          navigate("/");
        });
        localStorage.setItem("auth", '{"isLoggedIn" : "true", "username" : "' + username +' "}');
        
      }
    })
  }


  return (
    <div className='login_box'>
      <div className='lb_imgbox'>
        <img src={logoimg}/>
      </div>
      <div className='lb_body'>
        <div className='lb_error_msg'>{storeData?.user?.userDetails?.loginErrMsg}</div>
        <input className='lb_inputclass' type="text" placeholder='Username' onChange={(e) => setUsername(e.target.value)}/>
        <input className='lb_inputclass' type="text" placeholder='Password' onChange={(e) => setPassword(e.target.value)}/>
        <button className='login_btn' onClick={() => ValidateUser(username,password)}>Login</button>
      </div>
    </div>
  )
}

export default LoginPage