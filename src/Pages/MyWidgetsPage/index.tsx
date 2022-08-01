import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { subsStatement } from '../../Utils/cartFunctions';
import { FormControl, Radio, RadioGroup } from '@mui/material';

function MyWidgetsPage() {

    const [cardsArr, setCardsArr] = useState([]);
    const [showLoader, setShowLoader] = useState(false);


    const storeData = useSelector((data:any) => data);
    const dispatch = useDispatch();

    return (
        <>
            <div className='CartPage_container'>
                <div className='amount_box'>
                    <div className='cart_heading'>Filters</div>
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
                    <div className='cart_heading'>My Widgets</div>
                    {showLoader && storeData?.user?.userDetails?.cartWidgets?.length == 0 ? 
                        (<>
                            <div className='cart_loader'>
                                 Loading....
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
                                        <div className='pricebox'>Price : ₹ {obj?.details?.price}</div>
                                        <div className='hitcount_box'>Hitcount : {obj?.widget?.hitcount}</div>
                                    </div>
                                    <div className='cart_widget_amount'>
                                        <div className='cart_widget_systype'>{subsStatement(obj?.details)}</div>
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
        </>
    )
}

export default MyWidgetsPage