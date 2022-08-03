import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "../CartPage/CartPage.scss";
import CircularProgress from '@mui/material/CircularProgress';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import { setReduxUser } from '../../Utils/userFunctions';
import { setUserDetails } from '../../redux/UserRedux/userAction';
import { subsStatement } from '../../Utils/cartFunctions';
import CustomPopup from '../../Components/CustomPopup';
import { getUserDetails } from '../../Utils/userFunctions';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

function CartPage() {
    const [allWidgets, setAllWidgets] = useState([]);
    const [allCartWidgets, setAllCartWidgets] = useState([]);
    const storeData = useSelector((data:any) => data);
    const [showLoader, setShowLoader] = useState(false);
    const [CartEmptyMsg, setCartEmptyMsg] = useState("Cart is empty !");
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [CPWidgetObj, setCPWidgetObj] = useState({});
    const [showATCPopup, setShowATCPopup] = useState(false);
    const [itemsPrice, setItemsPrice] = useState(0);
    const [totaPrice, setTotaPrice] = useState(0);

    const username = storeData?.user?.userDetails?.username;

    useEffect(() => {
        // setShowLoader(true);
        // getUserDetails(username).then(data => {
        //     dispatch(setUserDetails(data))
        //     setShowLoader(false)
        //     console.log("CartPage Refreshed!")
        // });\
        // refresh();
        console.log("hi")
    }, []);

    function refresh(){
        setShowLoader(true);
        setReduxUser(username).then(data => {
            dispatch(setUserDetails(data))
            setShowLoader(false)
            console.log("CartPage Refreshed!")
        });
    }

    useEffect(() => {
        CalculatePrices()
    },[storeData?.user?.userDetails?.cartWidgets])

    const getOneWidget = (id:any) => {
        return new Promise((resolve:any,rej:any) => {
            axios.get("http://localhost:5000/products/"+id)
            .then(x => {
                resolve(x.data);
            });
        })
    }

    const getAllWidgets = () => {
        return new Promise((resolve:any,rej:any) => {
            axios.get("http://localhost:5000/products")
            .then(x => {
                setAllWidgets(x.data);
                resolve(x.data);
            });
        })
    }

    const dataReturn = (sData:any, index:any) => {
        let arr:any = [];
        if(sData?.length > 0){
            sData.map((wid:any) => {
                getOneWidget(wid.id)
                .then((aw:any) => {
                    arr.push(aw);
                });
            })
        }
        return arr[index]
    }

    const getCartWidgets = () => { 
        return new Promise((resolve:any,rej:any) => {
            axios.get("http://localhost:5000/user/gaurav")
            .then(x => {
                setAllCartWidgets(x.data.cartwidgets);
                resolve(x.data.cartwidgets)
            });
        })
    }

    const deleteCartItem = (id:any, username:any) => {
        let body:any = {
            "widgetId": id,
            "username": username
        }
        axios.patch("http://localhost:5000/user/deletefromcart", body)
        .then(x => {
            setShowLoader(true)
            console.log("Deleted id = ", id);
            setReduxUser(storeData?.user?.userDetails?.username).then(data => {
                dispatch(setUserDetails(data))
                setShowLoader(false)
            });
        })
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
        .then(x => {
          setShowATCPopup(false);
        });
    }

    const CalculatePrices = () => {
        let allprices = storeData?.user?.userDetails?.cartWidgets?.map((x:any) => x.details.price)
        let itemstotal = 0;
        if(allprices?.length > 0){
            itemstotal = allprices.reduce((a:any,b:any) => a+b);
            setItemsPrice(Math.round(itemstotal * 100) / 100);
        }

        let total = itemstotal + 0;
        setTotaPrice(Math.round(total * 100) / 100);
        console.log("calculated")
    }

    const PurchaseWidgets = () => {
        axios.patch("http://localhost:5000/user/purchasewidgets", {
            "username" : username
        })
        .then((data:any) => {
            navigate("/mywidgets");
            refresh();
            enqueueSnackbar(`Payment Successful !`, { variant: "success" });
        })
    }

    return (
        <>
        <div className='CartPage_container'>
            <div className='selected_widgets'>
            {/* <button onClick={() => {setReduxUser(storeData.user.userDetails.username)}}>Console Redux</button> */}
                <div className='cart_heading'>
                    <span className='cart_heading_text'>Cart</span>
                    <span className='refresh' onClick={() => refresh()}>Refresh</span> 
                </div>
                {showLoader ? 
                    (<>
                        <div className='cart_loader'>
                            <CircularProgress/>
                        </div>
                    </>) 
                    : 
                    (storeData?.user?.userDetails?.cartWidgets?.length > 0 ?
                        storeData?.user?.userDetails?.cartWidgets?.map((obj:any) => (
                        <div className='cart_widgetbox'>
                            <div className='cart_widget_img'></div>
                            <div className='cart_widget_details'>
                                <div className='cart_widget_name'>{obj?.widget?.title}</div>
                                <div className='cart_widget_desc'>
                                    {obj?.widget?.imgUrl}
                                    <div className='pricebox'>Price : ₹ {obj?.details?.price}</div>
                                    {/* <div className='hitcount_box'>Hitcount : {obj?.widget?.hitcount}</div> */}
                                </div>
                                <div className='cart_widget_amount'>
                                    <div className='cart_widget_systype'>{subsStatement(obj?.details)}</div>
                                    <div className='cart_widget_buttons'><span className='removebtn' onClick={() => {setShowATCPopup(true); setCPWidgetObj(obj?.details)}}>Edit</span> 
                                    {" | "}
                                    <span className='removebtn' onClick={() => ManualDeleteItem(obj?.details?.id, storeData?.user?.userDetails?.username)}>Remove</span></div>
                                </div>
                            </div>
                        </div>
                    ))
                    :
                    <div className='EmptyCart'> <ProductionQuantityLimitsIcon/> <span>{CartEmptyMsg}</span></div>
                    )
                }
            </div>
            <div className='amount_box'>
                <div className='cart_heading'>
                    <span className='cart_heading_text'>Price</span>
                    </div>
                <div className='price_row'>
                    <span>Item Price</span>
                    <span>₹ {itemsPrice}</span>
                </div>
                <div className='price_row'>
                    <span>Coupon Discount</span>
                    <span>₹ 0</span>
                </div>
                <div className='total_price price_row'>
                    <span>Total</span>
                    <span>₹ {totaPrice}</span>
                </div>
                {storeData?.user?.userDetails?.cartWidgets?.length > 0 && <button className='placeorder_btn' onClick={() => PurchaseWidgets()}>Place Order</button>} 
            </div>
        </div>
        {showATCPopup && 
            <CustomPopup
                page={"cart"}
                widgetObj={CPWidgetObj} 
                setShowATCPopup={setShowATCPopup}
            />
        }
        </>
    )
}

export default CartPage;