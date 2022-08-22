import { AppBar, Avatar, Badge, FilledInput, FormControl, Grid, IconButton, InputAdornment, InputLabel, Popover, TextField, Toolbar, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Engame_logo from "../../Assets/Engame_logo.png";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import AppPopup from '../AppPopup';
import { setUserDetails } from '../../redux/UserRedux/userAction';
import { useSnackbar } from 'notistack';

const Header = () => {
    const [isLoginOpen, setLoginIsOpen] = useState(false)
    const storeData = useSelector((data:any) => data);
    const localUser:any = localStorage.getItem("auth");
    const menuId = "primary-search-account-menu";
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const [isReginOpen, setReginIsOpen] = useState(false);
    const dispatch = useDispatch();
    const [errorMsg, setErrorMsg] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    let navigate = useNavigate();
    const [isPayment, setIsPayment] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [forgotPasswordPopup, setForgotPasswordPopup] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("login");
    const { enqueueSnackbar } = useSnackbar();


    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const popup = (type:any, isShow:any) => {
        setPopupType(type);
        setShowPopup(isShow)
    };

    let details = {
        isLoggedIn: false,
        loginErrMsg: "",
        username: "",
        firstname: "",
        lastname: "",
        isEmailVerified: false,
        accessToken: "",
        purchasedWidgets: [],
        cartWidgets: []
    }

    const logout = () => {
        localStorage.setItem("auth", '{"isLoggedIn" : "false", "username" : ""}');
        dispatch(setUserDetails(details));
        enqueueSnackbar(`User logged out !.`, { variant: "success" });
    }

    return (
        <>
            <AppBar className="flexGrow header-box " position={"sticky"}>
                <Toolbar className="header-padding header-text-color">
                <Typography variant="body1" className="flexGrow">
                    <NavLink to="/">
                    <img src={Engame_logo} />
                    </NavLink>
                </Typography>

                {!storeData?.user?.userDetails?.isLoggedIn ? (
                    <>
                    <div
                        className="menu-button"
                        onClick={() => popup("login", true)}
                    >
                        Login
                    </div>
                    <span className="vertical-line">|</span>
                    <div
                        className="menu-button registerBtn"
                        onClick={() => popup("register", true)}
                    >
                        Register
                    </div>
                    </>
                ) : (
                    <div className={"classes.sectionDesktop"}>
                        <div className="user-after-login">
                            <div className="shoping__card">
                                <NavLink to="cart">
                                    <Badge badgeContent={storeData?.user?.userDetails?.cartWidgets?.length} color="error">
                                        <ShoppingCartIcon/>
                                    </Badge>
                                </NavLink>
                            {/* <div className="shoping__card__cartHover">
                                <CartView />
                            </div> */}
                            </div>
                            <div className="user_avtar" onClick={(e:any) => handleClick(e)}>
                                <Avatar sx={{ bgcolor: "red" }}>{(JSON.parse(localUser)?.username[0])?.toUpperCase()}</Avatar>
                            </div>
                            <Popover 
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                disableScrollLock={true}
                                onClose={handleClose}
                                anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                                }}
                                transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                                }}
                                >
                                <div className="topnav_user_dd">
                                    <div className="tn_username tn_dd_row">{storeData?.user?.userDetails?.firstname + " " + storeData?.user?.userDetails?.lastname}</div>
                                    <NavLink to="/profile" className="tn_dd_row hover-bg-red">
                                        <PersonIcon/> <span className="tn_dd_text">Profile</span>
                                    </NavLink>
                                    <NavLink to="/mywidgets" className="tn_dd_row hover-bg-red">
                                        <DashboardIcon/> <span className="tn_dd_text">My Widgets</span>
                                    </NavLink>
                                    <NavLink to="/" className="tn_dd_row hover-bg-red" onClick={() => logout()}>
                                        <ExitToAppIcon/> <span className="tn_dd_text">Logout</span>
                                    </NavLink>
                                </div>
                            </Popover>
                        </div>
                    </div>
                )}
                </Toolbar>
            </AppBar>

            <AppPopup 
                showPopup={showPopup}
                setShowPopup={setShowPopup}
                type={popupType}
            />

        </>
    )
}

export default Header