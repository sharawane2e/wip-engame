import EditIcon from '@mui/icons-material/Edit';
import { Breadcrumbs, Button, ButtonBase, CircularProgress, Container, Grid, Paper, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CustomPopup from '../CustomPopup';
import { setUserDetails } from '../../redux/UserRedux/userAction';
import axios from 'axios';
import { setReduxUser } from '../../Utils/userFunctions';
import AppPopup from '../AppPopup';
// import "./Cart.scss";

const Cart = () => {

    const [showLoader, setShowLoader] = useState(false);
    const storeData = useSelector((data:any) => data);
    const [CPWidgetObj, setCPWidgetObj] = useState({});
    const [showATCPopup, setShowATCPopup] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("login");
    const dispatch = useDispatch();
    let navigate = useNavigate();

    const username = storeData?.user?.userDetails?.username;

    const BASE_URL = "https://apiengame.e2eresearch.com";

    const PurchaseWidgets = () => {
        axios.patch("http://localhost:5000/user/purchasewidgets", {
            "username" : username
        })
        .then((data:any) => {
            navigate("/mywidgets");
            refresh();
        })
    }

    const refresh = () => {
        setShowLoader(true);
        setReduxUser(username).then(data => {
            dispatch(setUserDetails(data))
            setShowLoader(false)
            console.log("CartPage Refreshed!")
        });
    }

    const ManualDeleteItem = (id:any, username:any) => {

        let storeObj = storeData?.user?.userDetails;
        let userObj = JSON.parse(JSON.stringify(storeObj));
        let widIndex = userObj.cartWidgets.findIndex((x:any) => x.details.id == id);

        userObj.cartWidgets.splice(widIndex,1)

        dispatch(setUserDetails(userObj));

        let body:any = {
            "widgetId": id,
            "username": userObj.username
        }
        axios.patch("http://localhost:5000/user/deletefromcart", body)
        .then((x:any) => {
          setShowATCPopup(false);
        });
    }

    const popup = (type:any, isShow:any, obj:any) => {
        setCPWidgetObj(obj);
        setPopupType(type);
        setShowPopup(isShow)
    };

    // useEffect(() => {
    //     console.log(CPWidgetObj)
    // }, [CPWidgetObj])

    return (
        <>
        <div className="bredcrum-conatiner ">
            <div className="bredcrum-conatiner__bredcrum_inr">
                <Container maxWidth="lg">
                    <Breadcrumbs
                    aria-label="breadcrumb"
                    className="bredcrum-conatiner__bredcrum-text"
                    >
                    <NavLink color="inherit" to="/">
                        Home
                    </NavLink>
                    <Typography
                        color="textPrimary"
                        className="bredcrum-conatiner__bredcrum-normaltext"
                    >
                        Shopping Cart
                    </Typography>
                    </Breadcrumbs>
                </Container>
            </div>

            {storeData?.user?.userDetails?.cartWidgets.length > 0 ? 
            (showLoader ? 
            (<>
                <div className='cart_loader'>
                    <CircularProgress/>
                </div>
            </>) 
            : 
            (
                <div className="shoping-cart shopping-cart-data">
                    <Container
                    maxWidth="lg"
                    className="shoping-cart__container sticky-position margin-top-174"
                    >
                    <Grid
                        container
                        spacing={3}
                        className="shoping-cart__container-inr"
                    >
                        <Grid
                        item
                        xl={12}
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                        className="shoping-cart__left-card"
                        >
                        Shopping Cart
                        </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                        <Grid item xl={9} lg={9} md={12} sm={12} xs={12}>
                        {storeData?.user?.userDetails?.cartWidgets?.map((item:any, index:any) => {
                            return (
                            <Paper
                                className="shoping-cart__tool-card card-box-shadow border--colordata border-radius"
                                key={index}
                            >
                                <Grid container spacing={3}>
                                <Grid
                                    item
                                    xl={2}
                                    lg={2}
                                    md={2}
                                    sm={2}
                                    xs={12}
                                    container
                                    className="shoping-cart__tool-images"
                                >
                                    <ButtonBase className="curent-tool-img">
                                    <img
                                        alt={item.widget?.name}
                                        title={item.widget?.name}
                                        src={BASE_URL + item.widget?.imgUrl}
                                    />
                                    </ButtonBase>
                                </Grid>
                                <Grid
                                    item
                                    xl={10}
                                    lg={10}
                                    md={10}
                                    sm={12}
                                    xs={12}
                                    container
                                >
                                    <Grid
                                    item
                                    xs
                                    container
                                    direction="row"
                                    spacing={2}
                                    className="shoping-cart__subscription-card"
                                    >
                                        <Grid item xs>
                                            <Typography
                                            gutterBottom
                                            component="div"
                                            className="shoping-cart__tool-title"
                                            >
                                            {item.widget.name}
                                            </Typography>
                                            <Typography
                                            variant="body2"
                                            gutterBottom
                                            className="shoping-cart__tool-discription"
                                            >
                                            This is the description of Widget. <br/>
                                            The discription can be edited.

                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid item xl={2} lg={2} md={2} sm={2} xs={12}>
                                        <Typography
                                            component="div"
                                            className="shoping-cart__total-amount"
                                        >
                                            {"₹"}{' '}
                                            {Number(item?.details?.price)}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} sm={12} container>

                                        <Grid item md={10} sm={10} xs={10}>
                                            <Typography
                                            component="div"
                                            className="shoping-cart__validity-input"
                                            >
                                            <Typography
                                                component="p"
                                                className="shoping-cart__subscription-text"
                                            >
                                                Subscription for
                                            </Typography>
                                            <Typography component="span">
                                                {item?.details?.total_count}
                                            </Typography>
                                            <Typography
                                                component="span"
                                                className="shoping-cart__input-days"
                                            >
                                                {item?.details?.subs_type}
                                            </Typography>
                                            </Typography>
                                        </Grid>

                                        <Grid
                                            item
                                            md={2}
                                            sm={2}
                                            xs={12}
                                            className="shoping-cart__tool-icons"
                                        >
                                            <Typography component="div">
                                            <Tooltip title="Edit" placement="top">
                                                <EditIcon
                                                className="shoping-cart__tool-tick"
                                                // onClick={() => {setShowATCPopup(true); setCPWidgetObj(item?.details)}}
                                                onClick={() => {popup("EditWidgetinCart", true, item)}}
                                                />
                                            </Tooltip>
                                            <Typography
                                                component="span"
                                                className="gray-color"
                                            >
                                                |
                                            </Typography>

                                            <Tooltip title="Delete" placement="top">
                                                <DeleteIcon
                                                className="shoping-cart__tool-delete"
                                                onClick={() => ManualDeleteItem(item?.details?.id, storeData?.user?.userDetails?.username)}
                                                />
                                            </Tooltip>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                </Grid>
                            </Paper>
                            );
                        })}
                        
                        </Grid>

                        <Grid
                            item
                            xl={3}
                            lg={3}
                            md={12}
                            sm={12}
                            xs={12}
                            className="border-radius sticky-card-position"
                        >
                            <Paper className="shoping-cart__card-coupon">
                            {/* <Paper> */}
                                <div className="shoping-cart__coupon-hedding">
                                Need to pay
                                </div>
                                <div className="shoping-cart__coupon-amount">
                            {"₹ "}
                                {storeData?.user?.userDetails?.cartWidgets.length > 0 ?
                                storeData?.user?.userDetails?.cartWidgets
                                    .map((item:any) => item?.details?.price)
                                    .reduce((acc:any, value:any) => +acc + +value) : 0}
                                </div>
                                <div className="shoping-cart__coupon-code">
                                {/* <span align="center">Promotion code</span> */}
                                <div
                                    className="shoping-cart__coupon-apply"
                                    // align="center"
                                >
                                    <input
                                    type="text"
                                    className="shoping-cart__coupon-apply-input"
                                    placeholder="Enter Promotion code"
                                    />
                                    <button>Apply</button>
                                </div>
                                </div>
                                <Button
                                //   onClick={handleCheckout}
                                onClick={() => PurchaseWidgets()}
                                className="primary-button checkout-button"
                                >
                                <CheckCircleIcon /> <span>Checkout</span>
                                </Button>
                            </Paper>

                            <div className="continue-button">
                                <NavLink to="/">
                                <button className="secondary-button width-fill-available">
                                    Continue Shopping
                                </button>
                                </NavLink>
                            </div>
                        </Grid>

                    </Grid>
                    </Container>
                </div>
            ))
            :
                <>
                    <div className="emptyPage">
                        <div className="emptyPage__headding">
                            <Typography
                                component="div"
                                className="emptyPage__headding__para"
                                color="textPrimary "
                            >
                                {""}
                            </Typography>
                        </div>
                        <div>
                            <img src="https://engame.e2eresearch.com/static/media/empty.ada06f30.gif" className="emptyPage__img" alt="Empty cart" />
                        </div>
                        <div className="emptyPage__button">
                            <NavLink to="/">
                                <button
                                    className="primary-button continueShoping"
                                    // onClick={handelLink}
                                >
                                    Continue Shoping
                                </button>
                            </NavLink>
                        </div>
                    </div>
                </>
            }

        </div>

        {showATCPopup && 
            <CustomPopup
                page={"cart"}
                widgetObj={CPWidgetObj} 
                setShowATCPopup={setShowATCPopup}
            />
        }

        <AppPopup
            showPopup={showPopup}
            setShowPopup={setShowPopup}
            type={popupType}
            widgetObj={CPWidgetObj}
        />

        </>
    )
}

export default Cart