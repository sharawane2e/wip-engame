import { Grid, Paper, Toolbar, Tooltip } from '@mui/material';
import React, { Dispatch, useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';
import { AddtoCartHelper } from '../../Utils/cartFunctions';
import { setisLoggedIn, setLoginErrMsg, setUserDetails } from '../../redux/UserRedux/userAction';
import { getUserDetails, setReduxUser } from '../../Utils/userFunctions';
import CustomPopup from '../CustomPopup';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneIcon from '@mui/icons-material/Done';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CodePopup from '../CodePopup';
import { crypt, decrypt } from '../../Utils/EncryptFunctions';
import PreviewPopup from '../PreviewPopup';
import CircularProgress from '@mui/material/CircularProgress';
import VisibilityIcon from '@mui/icons-material/Visibility';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import AppPopup from '../AppPopup';
import { isEmailVerified, verifyUserEmail } from '../../Utils/helperFunctions';


const AllWidgets = () => {

    const [cardsArr, setCardsArr] = useState([]);
    const [CPWidgetObj, setCPWidgetObj] = useState({});
    const { enqueueSnackbar } = useSnackbar();
    const storeData = useSelector((data:any) => data);
    const dispatch = useDispatch();
    const [showATCPopup, setShowATCPopup] = useState(false);
    const [showCodePopup, setShowCodePopup] = useState(false);
    const [showPreviewPopup, setShowPreviewPopup] = useState(false);
    const [searchbarText, setSearchbarText] = useState("");
    const [showLoader, setShowLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("");

    const BASE_URL = "https://apiengame.e2eresearch.com";
    const page = window.location.pathname;

    useEffect(() => {
        setShowLoader(true)
        getAllProducts();
        if(!storeData.user.userDetails.isLoggedIn && !storeData.email.emailDetails.isEmailRedirect){
            // popup("login", true)
            popup("emailsent", true)
        }
        if(storeData.email.emailDetails.isEmailRedirect){
            verifyUserEmail(storeData.email.emailDetails.accessToken)
            .then((x:any) => {
                console.log("x",x)
                if(x == true){
                    popup("EmailVerifySuccess", true);
                }
                else{
                    enqueueSnackbar(`Unable to verify email.`, { variant: "error" });
                }
            })
        }

        // if(storeData.user.userDetails.isLoggedIn && !storeData.user.userDetails.isEmailVerified){
        //     popup("verifyEmail", true);
        // }

    }, []);

    const getAllProducts = () => { 
        axios.get("http://localhost:5000/products")
        .then(x => {
            setCardsArr(x.data);
            setShowLoader(false)
        });
        console.log("CardsContainer Refreshed!")
    }

    const genSubscriptionKey = (widObj:any) => {
        let key = ""
        key = storeData?.user?.userDetails?.accessToken + "*" + widObj.id + "*" + "hits" + "*" + "true";
        let encrypt = crypt("saltise2eresearch", key)
        return encrypt;
    }

    const isInCart = (id:any) => {
        let len = storeData?.user?.userDetails?.cartWidgets?.filter((x:any) => x.details.id == id).length
        if(len>0){
            return false;
        }
        else{
            return true;
        }
    }

    const popup = (type:any, isShow:any) => {
        setPopupType(type);
        setShowPopup(isShow)
    };

    const handleCodePreview = (card:any) => {
        let cardObj = JSON.parse(JSON.stringify(card));
        // cardObj.widget_embed_code.replace('"*secratekey*"', "genSubscriptionKey(card)")
        // cardObj.widget_embed_code[942] = "gaurav";
        let genKey = genSubscriptionKey(card);
        cardObj.widget_embed_code = cardObj.widget_embed_code.replace('\"*secratekey*\"', '\"' + genKey + '\"')
        setCPWidgetObj(cardObj); 
        setShowCodePopup(true); 
    }

    function parseJwt (token:any) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    };

    const checkJWT = () => {
        const token = storeData.user.userDetails.accessToken;
        const { exp } = parseJwt(token);

        let checktoken = parseJwt("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImdhdXJhdiIsImlkIjoiNjMwMzQ0NjM4YWExNWUyYmViMzY2NDc4IiwiaWF0IjoxNjYxMTcwMTk4LCJleHAiOjE2NjExNzAyNTh9.ndfLPcorivvTno8epqjwamfUZ3KQVlzid2ax71b00no")

        if (Date.now() >= exp * 1000) {
          console.log("jwt expired", exp * 1000, Date.now(), checktoken, (Date.now() - (exp * 1000)))
        }
        else{
            console.log("jwt not expired", checktoken)
        }
    }

    return (
        <>
            {/* <button onClick={() => isUserExist("gaurav")}>Click</button> */}
            <div className="toolcard">
                <Toolbar className="toolcard__toolbar">
                    <Grid container spacing={4}>
                    {cardsArr.map((tooldata:any, index:any) => (
                        <Grid
                                item
                                xl={2}
                                lg={3}
                                md={3}
                                sm={4}
                                xs={12}
                                key={index}
                                id={tooldata.id}
                            >
                                <Paper className="toolcard__imageblck">
                                    <div className="toolcard__image">
                                        <img
                                        src={BASE_URL + tooldata.imgUrl}
                                        alt="Widget"
                                        />
                                        <div className="toolcard__preview">
                                            {/* <button className='custom-button toolcard__perview-button' onClick={() => {setCPWidgetObj(tooldata); setShowPreviewPopup(true)}}><VisibilityIcon className="eyes_icon" />{" "}Preview</button> */}
                                            <button className='custom-button toolcard__perview-button' onClick={() => {setCPWidgetObj(tooldata); popup("ToolPreview", true);}}><VisibilityIcon className="eyes_icon" />{" "}Preview</button>
                                        </div>
                                        <div className="toolcard__tooltip">
                                        <Tooltip title="How it works?" placement="top">
                                            <QuestionMarkIcon className="toolcard__tooltip__icon"/>
                                        </Tooltip>
                                        </div>
                                    </div>

                                    <div className="toolcard__align toolcard__toolicons">
                                        <div className="toolcard__items toolcard__download">
                                        <Tooltip title="Embeded Code" placement="top">
                                            <div className="toolcard__sub-icons" onClick={() => handleCodePreview(tooldata)}>
                                                {/* <EmbededCode /> */}
                                                Debug
                                            </div>
                                        </Tooltip>
                                        </div>
                                        <div className="toolcard__items toolcard__shopping">
                                        <Tooltip title="Add to cart" placement="top">
                                            <div className="toolcard__sub-icons" 
                                                // onClick={() => {setShowATCPopup(true); setCPWidgetObj(tooldata)}}
                                                onClick={() => {setCPWidgetObj(tooldata); popup( "AddToCart",true)}}
                                            >
                                                {isInCart(tooldata.id) ? (
                                                    <ShoppingCartIcon />
                                                ) : (
                                                    <ShoppingCartCheckoutIcon />
                                                )}
                                            </div>
                                        </Tooltip>
                                        </div>
                                    </div>
                                
                                </Paper>
                                
                                <div className="toolcard__align toolcard__toolname">
                                    <div className="toolcard__aligninr1 toolcard__font-family">
                                        {tooldata.toolname}
                                    </div>
                                </div>
                        </Grid>
                    ))}

                    </Grid>
                </Toolbar>
            </div>

            {showATCPopup && 
                <CustomPopup 
                    page={"home"}
                    widgetObj={CPWidgetObj} 
                    setShowATCPopup={setShowATCPopup}
                />
            }

            {showPreviewPopup &&
                <PreviewPopup
                    widgetObj={CPWidgetObj} 
                    clientkey={genSubscriptionKey(CPWidgetObj)}
                    setShowPreviewPopup={setShowPreviewPopup}
                />
            }

            {showCodePopup && 
                <CodePopup 
                    widgetObj={CPWidgetObj} 
                    setShowCodePopup={setShowCodePopup}
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

export default AllWidgets;