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

const AppPopup = (props:any) => {

    const { showPopup, type, setShowPopup, widgetObj } = props;
    const page = window.location.pathname;

    const storeData = useSelector((data:any) => data);
    const localUser:any = localStorage.getItem("auth");
    const [errorMsg, setErrorMsg] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showTPLoader, setShowTPLoader] = useState(true);
    const [itemCount, setItemCount] = useState(1000);
    const [itemPrice, setItemPrice] = useState(0);
    const [subsType, setSubsType] = useState("Hits");
    const [wtCount, setWtCount] = useState(100);
    const [wtPrice, setWtPrice] = useState(10);

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
    }, [showPopup]);

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

    return showPopup == true ? (
        <>
            <div className="popup-overlay"></div>
            <div className="popup-container">
                {type == "login" && 
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
                    </>
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

                {type == "AddToCart" &&
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

                {type == "EditWidgetinCart" &&
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

            </div>
        </>
    ) : null
}

export default AppPopup