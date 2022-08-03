import { AppBar, Avatar, Badge, Link, ListItemIcon, Menu, MenuItem, Stack, Toolbar, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { IconButton } from "@mui/material";
//@ts-ignore
import Engame_logo from "../../Assets/Engame_logo.png";
import "./TopNavBar.scss";
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useSelector } from "react-redux";

const TopNav = () => {
  const [isLoginOpen, setLoginIsOpen] = useState(false);
  const [isReginOpen, setReginIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPayment, setIsPayment] = useState();
  const storeData = useSelector((data:any) => data);

  const localUser:any = localStorage.getItem("auth");

  const menuId = "primary-search-account-menu";
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className="header-box">
        <div className="header_leftbox">
          <NavLink to="/">
            <img className="en_logo" src={Engame_logo}/>
          </NavLink>
        </div>
        <div className="header_rightbox">
          <div className="cart_icon">
            <NavLink to="/cart">
              <IconButton>
                <Badge badgeContent={storeData?.user?.userDetails?.cartWidgets?.length} color="error">
                  <ShoppingCartIcon/>
                </Badge>
              </IconButton>
            </NavLink>
          </div>
          <div className="user_avtar" onClick={(e:any) => handleClick(e)}>
            <Avatar sx={{ bgcolor: "red" }}>{(JSON.parse(localUser).username[0]).toUpperCase()}</Avatar>
          </div>
          <Popover 
            id={id}
            open={open}
            anchorEl={anchorEl}
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
                <NavLink to="/" className="tn_dd_row hover-bg-red">
                  <PersonIcon/> <span className="tn_dd_text">Profile</span>
                </NavLink>
                <NavLink to="/mywidgets" className="tn_dd_row hover-bg-red">
                  <DashboardIcon/> <span className="tn_dd_text">My Widgets</span>
                </NavLink>
                <NavLink to="/login" className="tn_dd_row hover-bg-red" onClick={() => localStorage.setItem("auth", '{"isLoggedIn" : "false", "username" : ""}')}>
                  <ExitToAppIcon/> <span className="tn_dd_text">Logout</span>
                </NavLink>
              </div>
          </Popover>
        </div>
      </div>
    </>
  );
};

export default TopNav;
