import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { subsStatement } from '../../Utils/cartFunctions';

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
                    <FormGroup>
                        <FormControlLabel control={<Checkbox />} label="Heatmaps & Highlighters" />
                        <FormControlLabel control={<Checkbox />} label="Rating" />
                        <FormControlLabel control={<Checkbox />} label="Single & Multi Selects" />
                        <FormControlLabel control={<Checkbox />} label="Maps" />
                        <FormControlLabel control={<Checkbox />} label="Ranking" />
                        <FormControlLabel control={<Checkbox />} label="Collection" />
                        <FormControlLabel control={<Checkbox />} label="Numeric" />
                    </FormGroup>
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