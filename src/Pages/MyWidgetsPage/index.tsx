import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { subsStatement } from '../../Utils/cartFunctions';
import { FormControl, Radio, RadioGroup } from '@mui/material';
import CodePopup from '../../Components/CodePopup';
import { crypt } from '../../Utils/EncryptFunctions';

function MyWidgetsPage() {

    const [cardsArr, setCardsArr] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    const [showCodePopup, setShowCodePopup] = useState(false);
    const [CPWidgetObj, setCPWidgetObj] = useState({});

    const storeData = useSelector((data:any) => data);
    const dispatch = useDispatch();

    function genSubscriptionKey(widObj:any){
        let key = ""
        key = storeData?.user?.userDetails?.accessToken + "*" + widObj.id + "*" + "hits" + "*" + "true";
        let encrypt = crypt("saltise2eresearch", key)
        return encrypt;
    }

    const handleCodePreview = (card:any) => {
        let cardObj = JSON.parse(JSON.stringify(card));
        // cardObj.widget_embed_code.replace('"*secratekey*"', "genSubscriptionKey(card)")
        // cardObj.widget_embed_code[942] = "gaurav";
        let genKey = genSubscriptionKey(card);
        cardObj.widget_embed_code = cardObj?.widget_embed_code?.replace('\"*secratekey*\"', '\"' + genKey + '\"')
        setCPWidgetObj(cardObj); 
        setShowCodePopup(true); 
    }

    return (
        <>
            <div className='CartPage_container'>
                <div className='amount_box'>
                    <div className='cart_heading'>
                        <span className='cart_heading_text'>Filters</span>
                    </div>
                    <FormControl>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                        >
                            <FormControlLabel value={1} control={<Radio />} label="Heatmaps & Highlighters" />
                            <FormControlLabel value={2} control={<Radio />} label="Rating" />
                            <FormControlLabel value={3} control={<Radio />} label="Single & Multi Selects" />
                            <FormControlLabel value={4} control={<Radio />} label="Maps" />
                            <FormControlLabel value={5} control={<Radio />} label="Ranking" />
                            <FormControlLabel value={6} control={<Radio />} label="Collection" />
                            <FormControlLabel value={7} control={<Radio />} label="Numeric" />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div className='selected_widgets'>
                {/* <button onClick={() => {setReduxUser(storeData.user.userDetails.username)}}>Console Redux</button> */}
                    <div className='cart_heading'>
                        <span className='cart_heading_text'>My Widgets</span>
                    </div>
                    {showLoader && storeData?.user?.userDetails?.cartWidgets?.length == 0 ? 
                        (<>
                            <div className='cart_loader'>
                                 Loading....
                            </div>
                        </>) 
                        : 
                        (storeData?.user?.userDetails?.purchasedWidgets?.length > 0 ?
                            storeData?.user?.userDetails?.purchasedWidgets?.map((obj:any) => (
                            <div className='cart_widgetbox'>
                                <div className='cart_widget_img'></div>
                                <div className='cart_widget_details'>
                                    <div className='cart_widget_name'>{obj?.widget?.title}</div>
                                    <div className='cart_widget_desc'>
                                        <div className='pricebox'>Price : ₹ {obj?.details?.price}</div>
                                        <div className='hitcount_box'>Hitcount : {obj?.widget?.hitcount}</div>
                                    </div>
                                    <div className='cart_widget_amount'>
                                        <div className='cart_widget_systype'>{subsStatement(obj?.details)}</div>
                                        <div onClick={() => handleCodePreview(obj?.widget)}>View Code</div>
                                        <div className='cart_widget_buttons'>Enabled</div>
                                    </div>
                                </div>
                            </div>
                        ))
                        :
                        <div className='EmptyCart'><span>No Purchased Widgets !</span></div>
                        )
                    }
                </div>

            </div>

            {showCodePopup && 
                <CodePopup 
                    widgetObj={CPWidgetObj} 
                    setShowCodePopup={setShowCodePopup}
                />
            }
        </>
    )
}

export default MyWidgetsPage