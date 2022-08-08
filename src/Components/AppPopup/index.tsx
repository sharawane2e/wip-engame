import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { FilledInput, FormControl, Grid, IconButton, InputAdornment, InputLabel, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { setLoginErrMsg, setUserDetails } from '../../redux/UserRedux/userAction';
import { setReduxUser } from '../../Utils/userFunctions';
import axios from 'axios';

const AppPopup = (props:any) => {

    const { showPopup, type, setShowPopup, widgetObj } = props;

    const storeData = useSelector((data:any) => data);
    const localUser:any = localStorage.getItem("auth");
    const dispatch = useDispatch();
    const [errorMsg, setErrorMsg] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    let navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showTPLoader, setShowTPLoader] = useState(true);

    useEffect(() => {
        setShowTPLoader(true);
        console.log("showPopup", showPopup)
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
            setShowPopup(false)
          }
        })
    }

    const hideLoader = () => {
        setShowTPLoader(false);
        console.log("loaded")
    }

    return showPopup == true ? (
        <>
            <div className="popup-overlay"></div>
            <div className="popup-container">
                {type == "login" && 
                    <div className="popup-container__iner popup-background popup-container__iner--xl border-radius">
                        <div className="popup-close" 
                            onClick={() => setShowPopup(false)}
                        >
                            <CloseIcon />
                        </div>
                        <div className="popup-container__body">
                        <Grid container spacing={1} className="popup-padding">
                            <Grid item xs={12} sm={12} lg={12}>
                                <div className="form-area login--form">
                                    <div className="form-area__login  large-hedding">Login</div>
                                    <form className="form-area__fileds" noValidate autoComplete="off">
                                    <div className="validated-error">
                                        {storeData?.user?.userDetails?.loginErrMsg}
                                    </div>
                                    <FormControl className="form-area__control">
                                        <TextField
                                        id="outlined-email-input"
                                        placeholder="E-mail address"
                                        value={username}
                                        onChange={(e:any) => setUsername(e.target.value)}
                                        // onBlur={(e) => handleBlur(e, "email")}
                                        // message={formErrors.email}
                                        type="Email"
                                        variant="filled"
                                        label="Email"
                                        // onKeyDown={_handleKeyDown}
                                        />
                                    </FormControl>
                                    <FormControl className="form-area__control" variant="filled">
                                        <InputLabel htmlFor="standard-adornment-password">
                                            Password
                                        </InputLabel>
                                        <FilledInput
                                        id="outlined-adornment-password"
                                        placeholder="***********************"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e:any) => setPassword(e.target.value)}
                                        // onBlur={(e) => handleBlur(e, "password")}
                                        // message={formErrors.password}
                                        // onKeyDown={handleKeyDown}
                                        endAdornment={
                                            <InputAdornment position="end">
                                            <IconButton
                                                // aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                <Visibility className="fill-eyecolor" />
                                                ) : (
                                                <VisibilityOff className="fill-eyecolor" />
                                                )}
                                            </IconButton>
                                            </InputAdornment>
                                        }
                                        />
                                    </FormControl>

                                    <div className="forgot-link">
                                        <NavLink to="#" 
                                        // onClick={forgotPassword}
                                        >
                                        Forgot password?
                                        </NavLink>
                                    </div>

                                    </form>
                                    <div className="form-button-grop">
                                    <button
                                        onClick={() => ValidateUser(username,password)}
                                        className="login__button primary-button"
                                    >
                                        Log In
                                    </button>
                                    </div>
                                    <div className="form-newaccont">
                                    <span>New Here?</span>
                                    <NavLink to="#" 
                                    // onClick={createAccount}
                                    >
                                        Create an Account
                                    </NavLink>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                        </div>
                    </div>
                }

                {type == "ToolPreview" &&
                    <>
                            <div className="popup-container__iner popup-container__iner--xxl border-radius tool-perview-data">
                                <div className="popup-close" onClick={() => setShowPopup(false)}>
                                    <CloseIcon />
                                </div>
                                <div className="popup-container__body">

                                    <div className="curent-tool-name custom-scroll">{widgetObj?.toolname}</div>
                                    {showTPLoader == true &&
                                         // <div className="tool-perview">
                                            <div className="previewLoader tool-perview">
                                                <div className="lds-ellipsis">
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                </div>
                                            </div> 
                                        // </div>
                                    }
                                    <iframe
                                        className="tool-perview"
                                        id="tool-perview"
                                        width="100%"
                                        src={widgetObj?.toolLink}
                                        // onLoad={hideLoader}
                                        onLoad={() => setShowTPLoader(false)}
                                    ></iframe>
                                </div>
                            </div>
                    </>
                }
            </div>
        </>
    ) : null
}

export default AppPopup