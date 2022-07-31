import React, { Dispatch, useEffect, useState } from 'react';
import "./CardsContainer.scss";
import axios from 'axios';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';
import { AddtoCartHelper } from '../../Utils/cartFunctions';
import { setisLoggedIn, setLoginErrMsg, setUserDetails } from '../../redux/UserRedux/userAction';
import { setReduxUser } from '../../Utils/userFunctions';
import CustomPopup from '../CustomPopup';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneIcon from '@mui/icons-material/Done';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CodePopup from '../CodePopup';
import { crypt, decrypt } from '../../Utils/EncryptFunctions';

function CardsContainer() {

    const [cardsArr, setCardsArr] = useState([]);
    const [CPWidgetObj, setCPWidgetObj] = useState({});
    const { enqueueSnackbar } = useSnackbar();
    const storeData = useSelector((data:any) => data);
    const dispatch = useDispatch();
    const [showATCPopup, setShowATCPopup] = useState(false);
    const [showCodePopup, setShowCodePopup] = useState(false);

    useEffect(() => {
        getAllProducts();
    }, [storeData]);
    
    const getAllProducts = () => { 
        axios.get("http://localhost:5000/products")
        .then(x => setCardsArr(x.data));
    }

    // const addToCart = (id:any) => {
    //     axios.post("http://localhost:5000/cart", 
    //         {
    //             "id": id,
    //             "subs_type": "hits",
    //             "hits_count": 4000,
    //             "days_count": 0,
    //             "price": 3000
    //         }
    //     )
    //     .then(x => {
    //         console.log("added")
    //         // showSnackBar("Item added to cart", 'success');
    //         enqueueSnackbar(`Item added to cart.`, { variant: "success" });
    //     })
    // }

    const addToCart = (id:any, dispatch?:any) => {
        axios.patch("http://localhost:5000/user/addtocart", 
            {
                "widget": {
                    "id": id,
                    "subs_type": "hits",
                    "hits_count": 4000,
                    "days_count": 0,
                    "price": 3000
                },
                "username": "gaurav"
            }
        )
        .then(x => {
            console.log("added", x.data)
            enqueueSnackbar(`Item added to cart.`, { variant: "success" });
        })
    }

    function disp(card:any){
        setCPWidgetObj(card);
        console.log(storeData.user)
        AddtoCartHelper(card, storeData)
        .then(x => {
            console.log(storeData)
            // setReduxUser(storeData?.user?.userDetails?.username).then(data => {
            //     dispatch(setUserDetails(data))
            // });
            axios.get("http://localhost:5000/user/" + storeData?.user?.userDetails?.username)
            .then((user:any) => {
                let data = user.data;
                let details = {
                    isLoggedIn: true,
                    loginErrMsg: "",
                    username: data?.username,
                    firstname: data?.firstname,
                    lastname: data?.lastname,
                    accessToken: data?.accessToken,
                    purchasedWidgets: data?.purchasedwidgets?.slice(),
                    cartWidgets: data?.cartwidgets?.slice()
                }
                dispatch(setUserDetails(data))
                // store.dispatch(setUserDetails(details));
            })
            enqueueSnackbar(`Item added to cart.`, { variant: "success" });
        })
    }

    function genSubscriptionKey(widObj:any){
        let key = ""
        key = storeData?.user?.userDetails?.accessToken + "*" + widObj.id + "*" + "hits" + "*" + "true";
        console.log("Subscription Key",key);
        let encrypt = crypt("saltise2eresearch", key)
        // console.log(decrypt("saltise2eresearch", encrypt));
        return encrypt;
    }

    const handleCodePreview = (card:any) => {
        let cardObj = JSON.parse(JSON.stringify(card));
        // cardObj.widget_embed_code.replace('"*secratekey*"', "genSubscriptionKey(card)")
        // cardObj.widget_embed_code[942] = "gaurav";
        let genKey = genSubscriptionKey(card);
        cardObj.widget_embed_code = cardObj.widget_embed_code.replace('\"*secratekey*\"', '\"' + genKey + '\"')
        setCPWidgetObj(cardObj); 
        setShowCodePopup(true); 
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

    return (
        <>
            <button onClick={() => {console.log(storeData.user.userDetails)}}>Console Redux</button>
            <div className='card_container'>
                {cardsArr.map((card:any) => (
                    <div className='card'>
                        <div className='card_img'></div>
                        <div className='card_title'>{card.title}</div>
                        <div className='card_footer'>
                            <button className='viewcode_button' onClick={() => handleCodePreview(card)}>{"</>"}</button>
                            {isInCart(card.id) ?
                                <button className='add_cart_button' onClick={() => {setShowATCPopup(true); setCPWidgetObj(card)}}>Add to Cart</button>
                            :
                                <button className='added_to_cart_button' onClick={() => {setShowATCPopup(true); setCPWidgetObj(card)}}><DoneIcon sx={{ fontSize: 18 }}/> Added </button>
                            }
                        </div>
                    </div>
                ))}
            </div>

            {showATCPopup && 
                <CustomPopup 
                    page={"home"}
                    widgetObj={CPWidgetObj} 
                    setShowATCPopup={setShowATCPopup}
                />
            }

            {showCodePopup && 
                <CodePopup 
                    widgetObj={CPWidgetObj} 
                    setShowCodePopup={setShowCodePopup}
                />
            }
        </>
    )
}

export default CardsContainer