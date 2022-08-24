import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Button, FilledInput, FormControl, Grid, IconButton, InputAdornment, InputLabel, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { setLoginErrMsg, setUserDetails } from '../../redux/UserRedux/userAction';
import { setReduxUser } from '../../Utils/userFunctions';
import axios from 'axios';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSnackbar } from 'notistack';
import { AddtoCartHelper } from '../../Utils/cartFunctions';
import CircularProgress from '@mui/material/CircularProgress';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import emailVerifyImg from "../../Assets/emailVerify3.png";
import { setEmailDetails } from '../../redux/EmailProcessRedux/emailAction';
import { getOneUserData, isEmailVerified, sendCustomMail } from '../../Utils/helperFunctions';

const AppPopup = (props:any) => {

    const { showPopup, type, setShowPopup, widgetObj } = props;
    const page = window.location.pathname;
    // let popupType = type;
    const [popupType, setPopupType] = useState("");

    useEffect(() => {
        setPopupType(type);
        console.log(type)
    }, [type])

    const storeData = useSelector((data:any) => data);
    const localUser:any = localStorage.getItem("auth");
    const [errorMsg, setErrorMsg] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [showTPLoader, setShowTPLoader] = useState(true); // Tool-Preview
    const [showURLoader, setShowURLoader] = useState(false); // User-Register
    const [showVELoader, setShowVELoader] = useState(false); // Verify-Email
    const [showRELoader, setShowRELoader] = useState(false); // Resend-Email
    const [subsType, setSubsType] = useState("Hits");
    const [wtCount, setWtCount] = useState(100);
    const [wtPrice, setWtPrice] = useState(10);
    const [showResendLink, setShowResendLink] = useState(false);
    const [resendEmail, setResendEmail] = useState("");
    const [resendError, setResendError] = useState("");

    const [newUserDetails, setNewUserDetails] = useState({
        "name" : "",
        "email": "",
        "password": "",
        "cpassword": ""
    });

    const [newUserErrors, setNewUserErrors] = useState({
        "nameError": "",
        "emailError": "",
        "passwordError": "",
        "cpasswordError": ""
    });

    let details = {
        isLoggedIn: false,
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

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        setShowTPLoader(true);
        if(type == "EditWidgetinCart"){
            setSubsType(widgetObj?.details?.subs_type);
            setWtCount(widgetObj?.details?.total_count);
            setWtPrice(widgetObj?.details?.price);
        }
        else if(type == "verifyEmail"){
            // if(storeData.email.emailDetails.isEmailRedirect || !storeData.user.userDetails.isEmailVerified){
            //     // logout();
            //     axios.post("http://localhost:5000/user/verifyemail/" + storeData.email.emailDetails.accessToken)
            //     .then((x:any) => {
            //         console.log(x.data)
            //         verifyEmail();
            //     })
            // }
            // else{
                verifyEmail();
            // }
        }
    }, [showPopup]);

    const logout = () => {
        localStorage.setItem("auth", '{"isLoggedIn" : "false", "username" : ""}');
        dispatch(setUserDetails(details));
    }

    const cartObj = {
        "details" : {
          "id": widgetObj?.details?.id,
          "subs_type": subsType,
          "total_count": Number(wtCount),
          "price": Number(wtPrice),
          "is_paused": false,
          "payment_method": "Net Banking"
        },
        "widget" : widgetObj,
        "username" : storeData?.user?.userDetails?.username
    }

    const ValidateUser = (uname:any, pswd:any) => {
        let isAuth:any;
        let emailVerified:any;
        let userObj = {
          "username": uname,
          "password": pswd
        }
        axios.post("http://localhost:5000/user/login", userObj)
        .then((x:any) => {
          console.log(x.data)
          isAuth = x.data.authenticated;
          emailVerified = x.data.isEmailVerified;
          if(!isAuth){
            setShowResendLink(false)
            dispatch(setLoginErrMsg("x.data.errorMsg"));
            localStorage.setItem("auth", '{"isLoggedIn" : "false", "username" : ""}');
          }
          else if(!emailVerified){
            setShowResendLink(true)
            localStorage.setItem("auth", '{"isLoggedIn" : "false", "username" : ""}');
          }
          else{
            setShowResendLink(false)
            setReduxUser(username)
            .then(data => {
                console.log(data)
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

    const ManualATC = () => {

        enqueueSnackbar(`Item added to cart.`, { variant: "success" });
    
        let storeObj = storeData?.user?.userDetails;
        let userObj = JSON.parse(JSON.stringify(storeObj));
    
        userObj.cartWidgets.push(cartObj);
        dispatch(setUserDetails(userObj));
        AddtoCartHelper(cartObj, storeData)
        .then(x => {
          setShowPopup(false);
        });
    }
    
    const editWidget = () => {
        let obj = {
        "detailObj" : cartObj.details,
        "username" : cartObj.username
        }
        axios.patch("http://localhost:5000/user/editcartwidget", obj)
        .then(x => {
        setReduxUser(storeData?.user?.userDetails?.username).then(data => {
            dispatch(setUserDetails(data));
            setShowPopup(false);
            enqueueSnackbar(`Cart item updated.`, { variant: "success" });
        });
        })
    }

    const registerUser = () => {

        console.log("newUserDetails", newUserDetails)

        let details:any = { ...newUserDetails };
        let errorObj:any = { ...newUserErrors };

        let obj = {
            "firstname": details.name,
            "lastname": " ",
            "username": details.name,
            "password": details.password,
            "isEmailVerified": false,
            "accessToken": "gggggggg",
            "purchasedwidgets": [],
            "cartwidgets": [],
            "phoneNumber": 0,
            "organization": " "
        }

        if(details.name == ""){
            errorObj.nameError = "Please enter your name !";
            errorObj.emailError = "";
            errorObj.passwordError = "";
            errorObj.cpasswordError = "";
        }
        else if(details.email == ""){
            errorObj.nameError = "";
            errorObj.emailError = "Please enter your email !";
            errorObj.passwordError = "";
            errorObj.cpasswordError = "";
        }
        else if(details.password == ""){
            errorObj.nameError = "";
            errorObj.emailError = "";
            errorObj.passwordError = "Please enter your password !";
            errorObj.cpasswordError = "";
        }
        else if(details.cpassword == ""){
            errorObj.nameError = "";
            errorObj.emailError = "";
            errorObj.passwordError = "";
            errorObj.cpasswordError = "Please confirm password !";
        }
        else if(details.cpassword != details.password){
            errorObj.nameError = "";
            errorObj.emailError = "";
            errorObj.passwordError = "";
            errorObj.cpasswordError = "Password does not match !";
        }
        else{
            setShowURLoader(true)
            axios.post("http://localhost:5000/user/adduser", obj)
            .then((x:any) => {
                console.log(x.data);
                setShowURLoader(false);
                // setReduxUser(x.data.username)
                // .then(data => {
                //   dispatch(setUserDetails(data))
                // });
                sendCustomMail({
                    "name": x.data.username,
                    "loginLink": "http://localhost:3000/emailverify/" + x.data.accessToken
                })
                localStorage.setItem("auth", '{"isLoggedIn" : "true", "username" : "' + x.data.username +' "}');
                setPopupType("emailsent")
            })
            .catch((err:any) => console.log(err))
        }

        setNewUserErrors(errorObj);

    }

    const handleUserInput = (key:string, val:any) => {
        let obj:any = { ...newUserDetails };
        obj[key] = val;
        setNewUserDetails(obj);
    }

    const registerErrors = (key:string, val:any) => {
        let obj:any = { ...newUserErrors };
        obj[key] = val;
        setNewUserErrors(obj);
    }

    const verifyEmail = () => {
        setShowVELoader(true);

        let token = storeData.email.emailDetails.isEmailRedirect ? storeData.email.emailDetails.accessToken : storeData.user.userDetails.accessToken;

        isEmailVerified(token)
        .then((x:any) => {
            console.log(x);
            setTimeout(() => {
                setShowVELoader(false);
                if(x == true){
                    setPopupType("EmailVerifySuccess")
                }
            }, 1000);
        })
    }

    useEffect(() => {
        CalcPrice()
    }, [wtCount, subsType]);
    
    const CalcPrice = () => {
        if(subsType == "Hits"){
            setWtPrice((wtCount)/10);
        }
        else{
            setWtPrice((wtCount)*5);
        }
    }

    const loginAgainbtn = () => {
        let dispatchObj = {
            "isEmailRedirect": false,
            "accessToken": ""
          }
    
        dispatch(setEmailDetails(dispatchObj));
        setShowResendLink(false);
        setPopupType("login");
    }

    const resendLinkEmail = () => {

        setShowRELoader(true);

        getOneUserData(resendEmail)
        .then((x:any) => {
            if(Object.keys(x).length > 0){

                setResendError("");
                let context = {
                    "name": x.username,
                    "loginLink": "http://localhost:3000/emailverify/" + x.accessToken
                }
                sendCustomMail(context)
                .then((x:any) => {
                    setShowRELoader(false);
                    setPopupType("emailsent")
                });
            }
            else{
                setShowRELoader(false);
                setResendError("No Such User");
            }
        })




    }

    return showPopup == true ? (
        <>
            <div className="popup-overlay"></div>
            <div className="popup-container">

                {popupType == "login" && 
                    <>
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

                                        {showResendLink ? 
                                            <div className="resend-error" onClick={() => setPopupType("resendMail")}>
                                                Email not verified ! <br/>
                                                Click <strong>here</strong> to resend link
                                            </div>
                                            :
                                            <div className="validated-error">
                                                {storeData?.user?.userDetails?.loginErrMsg}
                                            </div>
                                        }

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
                    </>
                }

                {popupType == "register" &&
                    <>
                        <div className="popup-container__iner popup-background popup-container__iner--xl border-radius">
                            <div className="popup-close" 
                                onClick={() => setShowPopup(false)}
                            >
                                <CloseIcon />
                            </div>
                            <div className="popup-container__body">
                                <Grid container spacing={1} className="popup-padding">
                                    <Grid item xs={12} sm={12} lg={12}>
                                            <div className="form-area registration--form">
                                                <div className="form-area__login  large-hedding">Register</div>
                                                <form className="form-area__fileds" noValidate autoComplete="off">

                                                {showURLoader ? 
                                                    <div className='user_register_loader'>
                                                        <CircularProgress />
                                                    </div>
                                                :
                                                    <>
                                                        <FormControl className="form-area__control">
                                                            <TextField
                                                            id="outlined-name-input"
                                                            placeholder="Name"
                                                            label="Name"
                                                            variant="filled"
                                                            // value={name}
                                                            onChange={(e) => handleUserInput("name", e.target.value)}
                                                            // onBlur={(e) => handleBlur(e, "name")}
                                                            // message={formErrors.name}
                                                            type="Name"
                                                            // variant="outlined"
                                                            // onKeyDown={_handleKeyDown}
                                                            />
                                                            <div className="validated-error">
                                                                {newUserErrors.nameError}
                                                            </div>
                                                        </FormControl>

                                                        <FormControl className="form-area__control">
                                                            <TextField
                                                            id="outlined-email-input"
                                                            placeholder="Emails"
                                                            type="Email"
                                                            label="E-mail"
                                                            variant="filled"
                                                            // value={email}
                                                            // onChange={(e) => handleChange(e, "email")}
                                                            onChange={(e) => handleUserInput("email", e.target.value)}
                                                            // onBlur={(e) => handleBlur(e, "email")}
                                                            // onBlur={(e) => handleCMail(e)}
                                                            // message={formErrors.email}
                                                            // onKeyDown={_handleKeyDown}
                                                            // onKeyUpCapture={(e) => handleCMail(e)}
                                                            />
                                                            <div className="validated-error">
                                                            {newUserErrors.emailError}
                                                            </div>
                                                        </FormControl>

                                                        <FormControl className="form-area__control"
                                                            variant="filled"
                                                        >
                                                            <InputLabel htmlFor="filled-adornment-password">
                                                            Password
                                                            </InputLabel>
                                                            <FilledInput
                                                            // label="E-mail"
                                                            id="outlined-adornment-password"
                                                            placeholder="Password "
                                                            type={showPassword ? "text" : "password"}
                                                            // value={setpassword}
                                                            // onChange={(e) => handleChange(e, "setpassword")}
                                                            onChange={(e) => handleUserInput("password", e.target.value)}
                                                            // onBlur={(e) => handleBlur(e, "setpassword")}
                                                            // message={formErrors.setpassword}
                                                            // onKeyDown={_handleKeyDown}
                                                            endAdornment={
                                                                <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                    edge="end"
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
                                                            <div className="validated-error">
                                                            {newUserErrors.passwordError}
                                                            </div>
                                                        </FormControl>

                                                        <FormControl
                                                            className="form-area__control"
                                                            variant="filled"
                                                        >
                                                            <InputLabel htmlFor="filled-adornment-password">
                                                            Confirm Password
                                                            </InputLabel>
                                                            <FilledInput
                                                            id="outlined-adornment-confirmpassword"
                                                            placeholder="Confirm Password"
                                                            type={showPasswordConfirm ? "text" : "password"}
                                                            // value={confirmpassword}
                                                            // onChange={(e) => handleChange(e, "confirmpassword")}
                                                            onChange={(e) => handleUserInput("cpassword", e.target.value)}
                                                            // onBlur={(e) => handleBlur(e, "confirmpassword")}
                                                            // message={formErrors.confirmpassword}
                                                            // onKeyDown={_handleKeyDown}
                                                            endAdornment={
                                                                <InputAdornment
                                                                position="end"
                                                                // onChange={(e) => checkPasswordMatch(e)}
                                                                >
                                                                <IconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                                                    edge="end"
                                                                >
                                                                    {showPasswordConfirm ? (
                                                                    <Visibility className="fill-eyecolor" />
                                                                    ) : (
                                                                    <VisibilityOff className="fill-eyecolor" />
                                                                    )}
                                                                </IconButton>
                                                                </InputAdornment>
                                                            }
                                                            />
                                                            <div className="validated-error">
                                                            {newUserErrors.cpasswordError}
                                                            </div>
                                                        </FormControl>
                                                    </>
                                                }
                                                </form>
                                                <div className="form-button-grop">
                                                <button
                                                    onClick={() => registerUser()}
                                                    className="register__button primary-button"
                                                >
                                                    Register
                                                </button>
                                                </div>
                                                <div className="form-newaccont">
                                                <span>Already a member?</span>
                                                <NavLink to="#" 
                                                    // onClick={backLogin} 
                                                    className=""
                                                    >
                                                        Login
                                                </NavLink>
                                                </div>
                                            </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </>
                }

                {popupType == "ToolPreview" &&
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

                {popupType == "AddToCart" &&
                    <>
                        <div className="popup-container__iner border-radius popup-container__iner--sm">
                            <div className="popup-container__header border-bottom">
                                <div className="popup-container__text ">Subscription Type</div>
                                <div className="popup-container__close" onClick={() => setShowPopup(false)}>
                                    <CloseIcon />
                                </div>
                            </div>
                            <div className="popup-container__body">
                                <div className="subscription-type">
                                    <div className="select-box">
                                    <select 
                                        onChange={(e:any) => setSubsType(e.target.value)} 
                                    >
                                            <option value="Days">Number of days</option>
                                            <option value="Hits">Number of hits</option>
                                    </select>
                                    </div>

                                    <div className="subscription-type__iner">
                                        <div className="subscription-type__days">
                                            <TextField
                                            type="number"
                                            id="outlined-basic"
                                            variant="outlined"
                                            name="hits"
                                            className="subscription-type__inputbox"
                                            value={wtCount}
                                            // onBlur={(e) => handleBlur(e, "email")}
                                            onChange={(e:any) => setWtCount(e.target.value)}
                                            />
                                            <div className="subscription-type__text">{subsType}</div>
                                        </div>
                                        <div className="subscription-type__amount  subscription-type__amount-text ">
                                            {/* {cart[0]?.currency} */}
                                            {/* {widgetObj?.details?.price?.toFixed(2)} */}
                                            {wtPrice}
                                        </div>
                                    </div>
                                    {/* <div className="validated-error">
                                        {isCountLimit}
                                        {isCountLimit && itemCount > 1 ? (
                                            <span>
                                            <a href="mailto:support-engame@e2eresearch.com"> email us </a> for
                                            help
                                            </span>
                                        ) : (
                                            ""
                                        )}
                                    </div> */}
                                </div>
                                <div className="popup-container__footer">
                                    <Button
                                        className="primary-button add--card"
                                        onClick={() => ManualATC()}
                                        disabled={wtCount === 0 ? true : false}
                                    >
                                        <ShoppingCartIcon className="hover-effect" /> Add to Cart
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                }

                {popupType == "EditWidgetinCart" &&
                    <>
                        <div className="popup-container__iner border-radius popup-container__iner--sm">
                            <div className="popup-container__header border-bottom">
                                <div className="popup-container__text ">Subscription Type</div>
                                <div className="popup-container__close" onClick={() => setShowPopup(false)}>
                                    <CloseIcon />
                                </div>
                            </div>
                            <div className="popup-container__body">
                                <div className="subscription-type">
                                    <div className="select-box">
                                    <select 
                                        onChange={(e:any) => setSubsType(e.target.value)} 
                                        value={subsType}
                                    >
                                            <option value="Days">Number of days</option>
                                            <option value="Hits">Number of hits</option>
                                    </select>
                                    </div>

                                    <div className="subscription-type__iner">
                                        <div className="subscription-type__days">
                                            <TextField
                                            type="number"
                                            id="outlined-basic"
                                            variant="outlined"
                                            name="hits"
                                            className="subscription-type__inputbox"
                                            value={wtCount}
                                            // onBlur={(e) => handleBlur(e, "email")}
                                            onChange={(e:any) => setWtCount(e.target.value)}
                                            />
                                            <div className="subscription-type__text">{subsType}</div>
                                        </div>
                                        <div className="subscription-type__amount  subscription-type__amount-text ">
                                            {/* {cart[0]?.currency} */}
                                            {/* {widgetObj?.details?.price?.toFixed(2)} */}
                                            {wtPrice}
                                        </div>
                                    </div>
                                    {/* <div className="validated-error">
                                        {isCountLimit}
                                        {isCountLimit && itemCount > 1 ? (
                                            <span>
                                            <a href="mailto:support-engame@e2eresearch.com"> email us </a> for
                                            help
                                            </span>
                                        ) : (
                                            ""
                                        )}
                                    </div> */}
                                </div>
                                <div className="popup-container__footer">
                                    <Button
                                        className="primary-button add--card"
                                        onClick={() => editWidget()}
                                        disabled={wtCount === 0 ? true : false}
                                    >
                                        <ShoppingCartIcon className="hover-effect" /> Edit Cart Item
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                }

                {popupType == "verifyEmail" &&
                    <>
                        <div className="popup-container__iner border-radius popup-container__iner--sm">
                            <div className="popup-container__header border-bottom">
                                <div className="popup-container__text ">Verify Email</div>
                                {/* <div className="popup-container__close" onClick={() => setShowPopup(false)}>
                                    <CloseIcon />
                                </div> */}
                            </div>
                            <div className="popup-container__body">

                                {showVELoader ? 
                                    <div className='verify_email_loader'>
                                        <CircularProgress />
                                    </div>
                                :
                                    <div className='verify_text'>
                                        Please verify your email first.
                                        Please click on the link shared on your email.
                                    </div>
                                }

                                <div className="popup-container__footer">
                                    <Button
                                        className="primary-button add--card verifybtns"
                                        // onClick={() => editWidget()}
                                        disabled={wtCount === 0 ? true : false}
                                    >
                                        Resend
                                    </Button>

                                    <Button
                                        className="primary-button add--card verifybtns"
                                        onClick={() => verifyEmail()}
                                        disabled={wtCount === 0 ? true : false}
                                    >
                                        Refresh
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                }

                {popupType == "EmailVerifySuccess" &&
                    <>
                        <div className="popup-container__iner popup-background popup-container__iner--xl border-radius">
                            <div className="popup-close" 
                                onClick={() => setShowPopup(false)}
                            >
                                <CloseIcon />
                            </div>
                            <div className="popup-container__body">

                                {showVELoader ? 
                                    <div className='verify_email_loader'>
                                        <CircularProgress />
                                    </div>
                                :
                                    <>
                                        <div className='verify_success_icon'>
                                            {/* <MarkEmailReadIcon fontSize="large" color="success"/> */}
                                            <img src={emailVerifyImg}/>
                                        </div>
                                        <div className='verify_success_text'>
                                            <h2>Email Verified Successfully</h2>
                                            <span>Thank you ! Your email has been verified successfully.</span>
                                        </div>
                                    </>
                                }

                                <div className="popup-container__footer">
                                    {storeData.user.userDetails.isLoggedIn ? 
                                        <Button
                                            className="primary-button add--card"
                                            onClick={() => setShowPopup(false)}
                                            sx={{minWidth: "100%"}}
                                        >
                                            Continue Shopping
                                        </Button>
                                    :
                                    <Button
                                        className="primary-button add--card"
                                        onClick={() => loginAgainbtn()}
                                        sx={{minWidth: "100%"}}
                                    >
                                        Login Now
                                    </Button>
                                    }
                                </div>
                            </div>
                        </div>
                    </>
                }

                {popupType == "emailsent" &&
                    <>
                        <div className="popup-container__iner popup-background popup-container__iner--xl border-radius">
                            <div className="popup-close" 
                                onClick={() => setShowPopup(false)}
                            >
                                <CloseIcon />
                            </div>
                            <div className="popup-container__body">

                                {showVELoader ? 
                                    <div className='verify_email_loader'>
                                        <CircularProgress />
                                    </div>
                                :
                                    <>
                                        <div className='verify_success_icon'>
                                            {/* <MarkEmailReadIcon fontSize="large" color="success"/> */}
                                            <img src={emailVerifyImg}/>
                                        </div>
                                        <div className='verify_success_text'>
                                            <h2>Activation Email Sent !</h2>
                                            <span>A mail has been sent to your registered email. Please click on the activation link to activate your account.</span>
                                        </div>
                                    </>
                                }

                                <div className="popup-container__footer">
                                    <Button
                                        className="primary-button add--card"
                                        onClick={() => loginAgainbtn()}
                                        sx={{minWidth: "100%"}}
                                    >
                                        Login Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                }

                {popupType == "resendMail" && 
                    <>
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
                                            <div className="form-area__login  large-hedding">Activation Link</div>
                                            <form className="form-area__fileds" noValidate autoComplete="off">

                                                    {showRELoader ? 
                                                        <div className='user_resendmail_loader'>
                                                            <CircularProgress />
                                                        </div>
                                                    :
                                                    <>
                                                        <FormControl className="form-area__control">
                                                            <TextField
                                                            id="outlined-email-input"
                                                            placeholder="E-mail address"
                                                            value={resendEmail}
                                                            onChange={(e:any) => setResendEmail(e.target.value)}
                                                            // onBlur={(e) => handleBlur(e, "email")}
                                                            // message={formErrors.email}
                                                            type="Email"
                                                            variant="filled"
                                                            label="Email"
                                                            // onKeyDown={_handleKeyDown}
                                                            />
                                                        </FormControl>

                                                        
                                                        {resendError.length > 0 
                                                            ? 
                                                            <div className='resend-error'>{resendError}</div> 
                                                            : 
                                                            ""
                                                        }

                                                        <div className="form-button-grop">
                                                        <button
                                                            onClick={() => resendLinkEmail()}
                                                            className="login__button primary-button"
                                                        >
                                                            Resend Activation Mail
                                                        </button>
                                                        </div>
                                                    </>
                                                    }


                                            </form>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </>
                }

                {popupType == "resetPassword" && 
                    <>
                        <div className="popup-container__iner popup-background popup-container__iner--xl border-radius">
                            <div className="popup-close" onClick={() => setShowPopup(false)}>
                                <CloseIcon />
                            </div>
                            <div className="popup-container__body">
                                <Grid container spacing={1} className="popup-padding">
                                    <Grid item xs={12} sm={12} lg={12}>
                                        <div className="form-area login--form">
                                            <div className="form-area__login  large-hedding">Reset Password</div>
                                            <form className="form-area__fileds" noValidate autoComplete="off">

                                                    {showRELoader ? 
                                                        <div className='user_resendmail_loader'>
                                                            <CircularProgress />
                                                        </div>
                                                    :
                                                    <>
                                                        <FormControl className="form-area__control" variant="filled">
                                                            <InputLabel htmlFor="standard-adornment-password">
                                                                Old Password
                                                            </InputLabel>
                                                            <FilledInput
                                                            id="outlined-adornment-password"
                                                            placeholder="***********************"
                                                            type={showPassword ? "text" : "password"}
                                                            value={password}
                                                            onChange={(e:any) => setPassword(e.target.value)}
                                                            endAdornment={
                                                                <InputAdornment position="end">
                                                                <IconButton onClick={() => setShowPassword(!showPassword)}>
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

                                                        <FormControl className="form-area__control" variant="filled">
                                                            <InputLabel htmlFor="standard-adornment-password">
                                                                New Password
                                                            </InputLabel>
                                                            <FilledInput
                                                            id="outlined-adornment-password"
                                                            placeholder="***********************"
                                                            type={showPassword ? "text" : "password"}
                                                            value={password}
                                                            onChange={(e:any) => setPassword(e.target.value)}
                                                            endAdornment={
                                                                <InputAdornment position="end">
                                                                <IconButton onClick={() => setShowPassword(!showPassword)}>
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

                                                        <FormControl className="form-area__control" variant="filled">
                                                            <InputLabel htmlFor="standard-adornment-password">
                                                                Confirm Password
                                                            </InputLabel>
                                                            <FilledInput
                                                            id="outlined-adornment-password"
                                                            placeholder="***********************"
                                                            type={showPassword ? "text" : "password"}
                                                            value={password}
                                                            onChange={(e:any) => setPassword(e.target.value)}
                                                            endAdornment={
                                                                <InputAdornment position="end">
                                                                <IconButton onClick={() => setShowPassword(!showPassword)}>
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
                                                        
                                                        {resendError.length > 0 
                                                            ? 
                                                            <div className='resend-error'>{resendError}</div> 
                                                            : 
                                                            ""
                                                        }

                                                        <div className="form-button-grop">
                                                        <button
                                                            onClick={() => resendLinkEmail()}
                                                            className="login__button primary-button"
                                                        >
                                                            Submit
                                                        </button>
                                                        </div>
                                                    </>
                                                    }


                                            </form>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </>
                }

            </div>
        </>
    ) : null
}

export default AppPopup