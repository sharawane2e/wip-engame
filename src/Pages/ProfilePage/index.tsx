import { Breadcrumbs, CircularProgress, Divider, Drawer, Grid, IconButton, List, ListItem, ListItemText, Paper, Toolbar, Typography } from '@mui/material'
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
import axios from 'axios';
import { setReduxUser } from '../../Utils/userFunctions';
import { setUserDetails } from '../../redux/UserRedux/userAction';
import AppPopup from '../../Components/AppPopup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
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
    const [inputPhone, setInputPhone] = useState(user?.phoneNumber == 0 ? "" : user?.phoneNumber);
    const [inputOrg, setInputOrg] = useState(user?.organization);
    const [editLoader, setEditLoader] = useState(false);
    const [myimage, setMyImage] = useState(null);
    const dispatch = useDispatch();
    const [inputEmail, setinputEmail] = useState("abc@e2eresearch.com");
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("");
    const [currentTab, setCurrentTab] = useState("User Profile");

    const [details, setDetails] = useState({
        "firstname": user?.firstname,
        "lastname": user?.lastname,
        "phone": user?.phoneNumber == 0 ? "" : user?.phoneNumber,
        "organization": user?.organization
    });

    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today  = new Date();
    let date = today.toLocaleDateString("hi-IN")

    const drawerWidth = 240;

    function createData(
        sno: number,
        uname: number,
        activity: string,
        time: number,
        area: string,
      ) {
        return { sno, uname, activity, time, area };
      }
      
      const rows = [
        createData(1, 159, "login", 24, "India"),
        createData(2, 237, "login", 37, "India"),
        createData(3, 262, "login", 24, "India"),
        createData(4, 305, "login", 67, "India"),
        createData(5, 356, "login", 49, "India"),
      ];

    const drawer = (
        <div>
          {/* <Toolbar /> */}
          <List sx={{ py: 3 }}>
            {["User Profile", "Usage", "Activity"].map((text, index) => (
              <ListItem
                button
                key={index}
                className={text == currentTab ? "ActiveBorderClass" : ""}
                onClick={() => setCurrentTab(text)}
              >

                <ListItemIcon sx={{ minWidth: "35px" }}>
                  {index == 0 || index == 2 ? (
                    <PersonIcon className={text == currentTab ? "ActiveIconClass" : ""} />
                  ) : (
                    <MailIcon className={text == currentTab ? "ActiveIconClass" : ""} />
                  )}
                </ListItemIcon>

                <ListItemText
                  primary={text}
                  className={text == currentTab ? "ActiveIconClass" : ""}
                />
              </ListItem>
            ))}
          </List>
        </div>
    );

    const saveDetails = () => {
        setEditLoader(true);

        let body = {
            id: null,
            firstname: details.firstname,
            lastname: details.lastname,
            username: user?.username,
            password: null,
            isEmailVerified: null,
            accessToken: null,
            purchasedwidgets: null,
            cartwidgets: null,
            phoneNumber: details.phone,
            organization: details.organization
          }
        axios.patch("http://localhost:5000/user/updateuser", body)
        .then((x:any) => {
            if(x.status == 200){
                console.log(x.data)
                // setDetails({
                //     "firstname": x.data.firstname,
                //     "lastname": x.data.lastname,
                //     "phone": x.data.phoneNumber == 0 ? "" : x.data.phoneNumber,
                //     "organization": x.data.organization
                // })
                // let existing = { ...user };
                // existing.firstname = details.firstname;
                // existing.lastname = details.lastname;
                // existing.phoneNumber = details.phone;
                // existing.organization = details.organization;

                setTimeout(() => {
                    setEditLoader(false)
                    setEditing(false)
                    setReduxUser(user?.username)
                    .then((data:any) => {
                        console.log(data)
                        dispatch(setUserDetails(data))
                    });
                }, 1000);
            }
        })
    }

    const updateDetail = (key:string, value:any) => {
        let obj:any = { ...details };
        obj[key] = value;
        setDetails(obj);
    }

    const popup = (type:any, isShow:any) => {
        setPopupType(type);
        setShowPopup(isShow);
    };

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
                                <Drawer
                                    variant="temporary"
                                    open={mobileOpen}
                                    ModalProps={{
                                        keepMounted: true,
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
                                    {currentTab == "User Profile" && <div className="profile-container">
                                        <Grid container spacing={2}>

                                        <Grid item xs={12} md={5} sm={12}>
                                            <div className={myimage ? "profile-container__image-container" : "profile-container__image-noImage"}>
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
                                        
                                        {editLoader ? 
                                            <Grid item xs={12} md={7} sm={12}>
                                                <div className='user_editDetails_loader'>
                                                        <CircularProgress />
                                                </div>
                                            </Grid>
                                        :
                                            <Grid item xs={12} md={7} sm={12}>
                                                <div className="common-display-flex">
                                                <Typography
                                                    color="textPrimary"
                                                    component="div"
                                                    className="profile-container__pad-profile flex-common"
                                                >
                                                    First Name
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
                                                        value={details.firstname}
                                                        onChange={(e) => updateDetail("firstname", e.target.value)}
                                                    />
                                                    ) : (
                                                    `${details.firstname}`
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
                                                        value={details.lastname}
                                                        onChange={(e) => updateDetail("lastname", e.target.value)}
                                                    />
                                                    ) : (
                                                    `${details.lastname}`
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
                                                        value={details.phone}
                                                        onChange={(e) => updateDetail("phone", e.target.value)}
                                                    />
                                                    ) : (
                                                    `${details.phone}`
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
                                                        value={user?.username}
                                                        disabled
                                                    />
                                                    ) : (
                                                    `${user?.username} `
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
                                                        value={details.organization}
                                                        onChange={(e:any) => updateDetail("organization",e.target.value)}
                                                    />
                                                    ) : (
                                                        details.organization
                                                    )}
                                                </Typography>
                                                </div>
                                            </Grid>
                                        }

                                        <Grid item xs={12} md={12}>
                                            {editing ? (
                                            <div className="form-button-grop">
                                                <button
                                                    className="profile-container__edit-button primary-button editbtn"
                                                    onClick={() => saveDetails()}
                                                    >
                                                    Save Details
                                                </button>
                                                <button
                                                    className="profile-container__edit-button secondary-button editbtn"
                                                    onClick={() => setEditing(false)}
                                                    >
                                                    Cancel
                                                </button>
                                            </div>
                                            ) : (
                                            <div className="form-button-grop">
                                                <button
                                                className="profile-container__edit-button secondary-button editbtn"
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
                                                <span onClick={() => popup("resetPassword", true)}> UPDATE </span>
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
                                    </div>}

                                    {currentTab == "Usage" && <div className='profile-container'>
                                        <div className='tabheader'>Usage</div>
                                    </div>}

                                    {currentTab == "Activity" && <div className='profile-container'>
                                        <div className='tabheader'>Activity</div> 

                                        <TableContainer component={Paper}>
                                            <Table aria-label="simple table">
                                                <TableHead>
                                                <TableRow>
                                                    <TableCell align="center" width={70}>S No.</TableCell>
                                                    <TableCell align="right" width={170}>User Name</TableCell>
                                                    <TableCell align="right" width={210}>Activity Type</TableCell>
                                                    <TableCell align="right" width={210}>Time</TableCell>
                                                    <TableCell align="right" width={150}>Area</TableCell>
                                                </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                {rows.map((row) => (
                                                    <TableRow
                                                        key={row.sno}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        {/* <TableCell component="th" scope="row">
                                                            {row.name}
                                                        </TableCell> */}
                                                        <TableCell align="center">{row.sno}</TableCell>
                                                        <TableCell align="right">{user?.username}</TableCell>
                                                        <TableCell align="right">{row.activity}</TableCell>
                                                        <TableCell align="right">{date}</TableCell>
                                                        <TableCell align="right">{row.area}</TableCell>
                                                    </TableRow>
                                                ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>}

                                </Box>
                            </Paper>
                            </Box>
                    </div>
                </Container>
    
                <Footer />
            </div>

            <AppPopup
                showPopup={showPopup}
                setShowPopup={setShowPopup}
                type={popupType}
                widgetObj={{}}
            />
        </>
    )
}

export default ProfilePage