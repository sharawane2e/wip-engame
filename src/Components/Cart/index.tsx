import EditIcon from '@mui/icons-material/Edit';
import { Breadcrumbs, Button, ButtonBase, CircularProgress, Container, Grid, Paper, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import "./Cart.scss";

const Cart = () => {

    const [showLoader, setShowLoader] = useState(false);
    const storeData = useSelector((data:any) => data);

    const BASE_URL = "https://apiengame.e2eresearch.com";

    return (
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
        {showLoader ? 
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
                                  Description Description Description
                                  Description Description Description\
                                  Description Descri
                                  ptionDescriptionptionDescriptionptionDescriptionptionDescriptionptionDescriptionptionDescription
                                </Typography>
                              </Grid>
                            </Grid>
                            <Grid item xl={2} lg={2} md={2} sm={2} xs={12}>
                              <Typography
                                component="div"
                                className="shoping-cart__total-amount"
                              >
                                {"$"}{' '}
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
                                    //   onClick={() => {
                                    //     setRenew(true);
                                    //     setProductShow(item);
                                    //   }}
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
                                    //   onClick={() => {
                                    //     // dispatch(removeFromCart(item.id));
                                    //     handleRemove(item.id);
                                    //     //setProduct(item.id);
                                    //   }}
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
                   {"$ "}
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
        )}
      </div>
    )
}

export default Cart