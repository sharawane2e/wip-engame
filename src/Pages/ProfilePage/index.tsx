import { Breadcrumbs, Divider, Drawer, Grid, IconButton, List, ListItem, ListItemText, Paper, Toolbar, Typography } from '@mui/material'
import { Box, Container } from '@mui/system';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Footer from '../../Components/Footer';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import HelpIcon from '@mui/icons-material/Help';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ListIcon from '@mui/icons-material/List';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
// import ImageNoImage1 from "../../assets/images/noimage.jfif";
import ImageNoImage from "../../Assets/images/noimg.png";
import ListItemIcon from '@mui/material/ListItemIcon';
// import ImageNoImage1 from "../../Assets/images/noimage.jfif";


function ProfilePage() {

    const storeData = useSelector((data:any) => data);

    const user = storeData.user.userDetails;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapse, setCollapse] = useState(false);
    const [editing, setEditing] = useState(false);
    const [screenSize, setScreenSize] = useState(window.innerWidth);
    const [inputFirstName, setInputFirstName] = useState(user?.firstname);
    const [inputLastName, setInputLastName] = useState(user?.lastname);
    const [inputPhone, setInputPhone] = useState(987654321);
    const [myimage, setMyImage] = useState(null);
    const dispatch = useDispatch();
    const [inputEmail, setinputEmail] = useState("abc@e2eresearch.com")

    const drawerWidth = 240;

    const drawer = (
        <div>
          {/* <Toolbar /> */}
          <List sx={{ py: 3 }}>
            {["User Profile", "Usage", "Activity"].map((text, index) => (
              <ListItem
                button
                key={index}
                className={index == 0 ? "ActiveBorderClass" : ""}
              >

                <ListItemIcon sx={{ minWidth: "35px" }}>
                  {index == 0 || index == 2 ? (
                    <PersonIcon className={index == 0 ? "ActiveIconClass" : ""} />
                  ) : (
                    <MailIcon />
                  )}
                </ListItemIcon>

                <ListItemText
                  primary={text}
                  className={index == 0 ? "ActiveIconClass" : ""}
                />
              </ListItem>
            ))}
          </List>
        </div>
      );

    return (
        <>
            <div className="purchased-tool bredcrum-conatiner">
                <div className="bredcrum-conatiner__bredcrum_inr ">
                    <Container maxWidth="lg" className="breadcrum-main">
                    <Breadcrumbs
                        aria-label="breadcrumb"
                        className="bredcrum-conatiner__bredcrum-text"
                    >
                        <NavLink color="inherit" to="/">
                            Home
                        </NavLink>
                        <Typography
                            color="textPrimary"
                            component="div"
                            className="bredcrum-conatiner__bredcrum-normaltext"
                            >
                            User Profile
                        </Typography>
                    </Breadcrumbs>
                    </Container>
                </div>
    
                <Container maxWidth="lg">
                    <div className="Drawer-container">
                        <Box sx={{ display: "flex" }}>
                            <Toolbar className={"Toolbar-style"}>
                                <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                // onClick={handleDrawerToggle}
                                className={collapse ? "Toolbar-style__IconButton-style" : "Toolbar-style__IconButton-style-none"}
                                >
                                <MenuIcon />
                                </IconButton>
                            </Toolbar>

                            <Box
                                component="nav"
                                sx={{
                                width: { sm: drawerWidth },
                                flexShrink: { sm: 0 },
                                }}
                                aria-label="mailbox folders"
                            >
                                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                                <Drawer
                                variant="temporary"
                                open={mobileOpen}
                                // onClose={handleDrawerToggle}
                                ModalProps={{
                                    keepMounted: true, // Better open performance on mobile.
                                }}
                                sx={{
                                    display: { xs: "block", sm: "none" },
                                    "& .MuiDrawer-paper": {
                                    boxSizing: "border-box",
                                    width: drawerWidth,
                                    height: "100vh",
                                    backgroundColor: "white !important",
                                    },
                                }}
                                >
                                {drawer}
                                </Drawer>
                                <Drawer
                                variant="permanent"
                                sx={{
                                    display: { xs: "none", sm: "block" },
                                    "& .MuiDrawer-paper": {
                                    boxSizing: "border-box",
                                    width: drawerWidth,
                                    zIndex: "9",
                                    height: "100vh",
                                    position: "static !important",
                                    },
                                }}
                                open
                                >
                                {drawer}
                                </Drawer>
                            </Box>
                            <Paper className="Paper-class">
                                <Box
                                component="main"
                                sx={{
                                    flexGrow: 1,
                                    p: 3,
                                }}
                                >
                                <div className="profile-container">
                                    <Grid container spacing={2}>
                                    <Grid item xs={12} md={4} sm={12}>
                                        <div
                                        className={
                                            myimage
                                            ? "profile-container__image-container"
                                            : "profile-container__image-noImage"
                                        }
                                        >
                                        <img src={myimage ? myimage : ImageNoImage} />
                                        <input
                                            type="file"
                                            // onChange={uploadImage}
                                            className="input-img"
                                            title=" "
                                            id="img"
                                            style={{ display: "none" }}
                                        />
                                        <label
                                            htmlFor="img"
                                            className="profile-container__image-container__btn-info"
                                        >
                                            <EditIcon />
                                        </label>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={8} sm={12}>
                                        <div className="common-display-flex">
                                        <Typography
                                            color="textPrimary"
                                            component="div"
                                            className="profile-container__pad-profile flex-common"
                                        >
                                            Name
                                        </Typography>
                                        <Typography
                                            color="textPrimary"
                                            component="div"
                                            className="profile-container__pad-profile flex-common-60"
                                        >
                                            {editing ? (
                                            <input
                                                type="text"
                                                name="first_name"
                                                className="input-filds"
                                                value={inputFirstName}
                                                onChange={(e) => setInputFirstName(e.target.value)}
                                            />
                                            ) : (
                                            `${inputFirstName}`
                                            )}
                                        </Typography>
                                        </div>
                                        <div className="common-display-flex">
                                        <Typography
                                            color="textPrimary"
                                            component="div"
                                            className="profile-container__pad-profile flex-common"
                                        >
                                            Last Name
                                        </Typography>
                                        <Typography
                                            color="textPrimary"
                                            component="div"
                                            className="profile-container__pad-profile flex-common-60"
                                        >
                                            {editing ? (
                                            <input
                                                type="text"
                                                name="last_name"
                                                className="input-filds"
                                                value={inputLastName}
                                                onChange={(e) => setInputLastName(e.target.value)}
                                            />
                                            ) : (
                                            `${inputLastName}`
                                            )}
                                        </Typography>
                                        </div>
                                        <div className="common-display-flex">
                                        <Typography
                                            color="textPrimary"
                                            component="div"
                                            className="profile-container__pad-profile flex-common"
                                        >
                                            Phone Number
                                        </Typography>
                                        <Typography
                                            color="textPrimary"
                                            component="div"
                                            className="profile-container__pad-profile flex-common-60"
                                        >
                                            {editing ? (
                                            <input
                                                type="text"
                                                className="input-filds"
                                                value={inputPhone}
                                                onChange={(e:any) => setInputPhone(e.target.value)}
                                            />
                                            ) : (
                                            `${inputPhone}`
                                            )}
                                        </Typography>
                                        </div>
                                        <div className="common-display-flex">
                                        <Typography
                                            color="textPrimary"
                                            component="div"
                                            className="profile-container__pad-profile flex-common"
                                        >
                                            Email Address
                                        </Typography>
                                        <Typography
                                            color="textPrimary"
                                            component="div"
                                            className="profile-container__pad-profile flex-common-60"
                                        >
                                            {editing ? (
                                            <input
                                                type="text"
                                                className="input-filds"
                                                value={inputEmail}
                                            />
                                            ) : (
                                            `${inputEmail} `
                                            )}
                                        </Typography>
                                        </div>
                                        <div className="common-display-flex">
                                        <Typography
                                            color="textPrimary"
                                            component="div"
                                            className="profile-container__pad-profile flex-common"
                                        >
                                            Organisation
                                        </Typography>
                                        <Typography
                                            color="textPrimary"
                                            component="div"
                                            className="profile-container__pad-profile flex-common-60"
                                        >
                                            {editing ? (
                                            <input
                                                type="text"
                                                className="input-filds"
                                                value={"E2Eservices"}
                                            />
                                            ) : (
                                            "E2Eservices"
                                            )}
                                        </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        {editing ? (
                                        <div className="form-button-grop">
                                            <button
                                            className="profile-container__edit-button primary-button login__button"
                                            // onClick={onSubmit}
                                            >
                                            Save Details
                                            </button>
                                        </div>
                                        ) : (
                                        <div className="form-button-grop">
                                            <button
                                            className="profile-container__edit-button secondary-button login__button"
                                            onClick={() => setEditing(true)}
                                            >
                                            Edit Details
                                            </button>
                                        </div>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={12} sm={12}>
                                        <Divider
                                        variant="middle"
                                        className="profile-container__divider-style"
                                        />
                                    </Grid>
                                    </Grid>
                                    {/*Bootm Section */}
                                    <Grid container spacing={2} sx={{ mt: 3 }}>
                                    <Grid item xs={12} md={6} sm={6}>
                                        <Paper elevation={3} className="profile-container__paper-style">
                                        <Grid container>
                                            <Grid
                                            item
                                            xs={6}
                                            md={6}
                                            className="profile-container__password-style"
                                            >
                                            Password
                                            </Grid>
                                            <Grid
                                            item
                                            xs={8}
                                            md={6}
                                            sm={8}
                                            className="profile-container__update-style"
                                            >
                                            UPDATE
                                            </Grid>
                                            <Grid item xs={4} md={12} sm={4}>
                                            ********
                                            </Grid>
                                            <Grid item xs={9} md={12} sm={9}>
                                            Last modified on this date
                                            </Grid>
                                        </Grid>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={12} md={6} sm={6}>
                                        <Paper
                                        elevation={3}
                                        className="profile-container__paper-style"
                                        sx={{ mb: 1 }}
                                        >
                                        <Grid container className="profile-container__grid-container">
                                            <Grid
                                            item
                                            xs={2}
                                            md={2}
                                            className="profile-container__grid-icon"
                                            >
                                            <HelpIcon />
                                            </Grid>
                                            <Grid
                                            item
                                            xs={6}
                                            md={6}
                                            className="profile-container__grid-text"
                                            >
                                            Need help or support
                                            </Grid>
                                            <Grid
                                            item
                                            xs={4}
                                            className="profile-container__Grid-greater-style"
                                            >
                                            <ArrowForwardIosIcon />
                                            </Grid>
                                        </Grid>
                                        </Paper>
                                        <Grid item xs={12}>
                                        <Paper
                                            elevation={3}
                                            className="profile-container__paper-style2"
                                        >
                                            <Grid
                                            container
                                            className="profile-container__grid-container"
                                            >
                                            <Grid
                                                item
                                                xs={2}
                                                md={2}
                                                className="profile-container__grid-icon"
                                            >
                                                <FeedbackIcon />
                                            </Grid>
                                            <Grid
                                                item
                                                xs={6}
                                                md={6}
                                                className="profile-container__grid-text"
                                            >
                                                Share your feedback
                                            </Grid>
                                            <Grid
                                                item
                                                xs={4}
                                                className="profile-container__Grid-greater-style"
                                            >
                                                <ArrowForwardIosIcon />
                                            </Grid>
                                            </Grid>
                                        </Paper>
                                        </Grid>
                                    </Grid>
                                    </Grid>
                                </div>
                                </Box>
                            </Paper>
                            </Box>
                    </div>
                </Container>
    
                <Footer />
            </div>
        </>
    )
}

export default ProfilePage