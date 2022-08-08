import React, { Dispatch, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Select, SelectChangeEvent } from '@mui/material';
import { MenuItem } from '@mui/material';
import { ListSubheader } from '@mui/material';
import { InputLabel } from '@mui/material';
import { FormControl } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AddtoCartHelper, subsStatement } from '../../Utils/cartFunctions';
import { setReduxUser } from '../../Utils/userFunctions';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';
import { setUserDetails } from '../../redux/UserRedux/userAction';
import axios from 'axios';
import CodePopup from '../CodePopup';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 1,
  };
  
  type CustomPopupProps = {
    page: any;
    widgetObj: any;
    setShowATCPopup: any;
  };

function WdetailsPopup({page, widgetObj, setShowATCPopup}: CustomPopupProps) {

    const storeData = useSelector((data:any) => data);
    const [subsType, setSubsType] = useState(page == "home" ? "Hits" : widgetObj?.subs_type);
    const [wtCount, setWtCount] = useState<any>(page == "home" ? 100 : widgetObj?.total_count);
    const [wtPrice, setWtPrice] = useState<any>(page == "home" ? 10 : widgetObj?.price);
  
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
  
    // useEffect(() => {
    //   CalcPrice()
    // }, [wtCount, subsType])
  
    const cartObj = {
      "details" : {
        "id": widgetObj.id,
        "subs_type": subsType,
        "total_count": Number(wtCount),
        "price": Number(wtPrice)
      },
      "widget" : widgetObj,
      "username" : storeData?.user?.userDetails?.username
    }

    const CalcPrice = () => {
        if(subsType == "Hits"){
          setWtPrice((wtCount)/10);
        }
        else{
          setWtPrice((wtCount)*5);
        }
      }

    const addToCart = () => {
        console.log(storeData.user)
        AddtoCartHelper(cartObj, storeData)
        .then(x => {
            console.log(storeData)
            setReduxUser(storeData?.user?.userDetails?.username).then(data => {
                dispatch(setUserDetails(data))
            });
            enqueueSnackbar(`Item added to cart.`, { variant: "success" });
            setShowATCPopup(false)
        })
      }
    
      const editWidget = () => {
        let obj = {
          "detailObj" : cartObj.details,
          "username" : cartObj.username
        }
        axios.patch("http://localhost:5000/user/editcartwidget", obj)
        .then(x => {
          setReduxUser(storeData?.user?.userDetails?.username).then(data => {
            dispatch(setUserDetails(data));
            setShowATCPopup(false)
            enqueueSnackbar(`Cart item updated.`, { variant: "success" });
          });
        })
      }

    return (
        <div className='popup_body'>
            <FormControl sx={{ m: 1, minWidth: "-webkit-fill-available" }} size="small">
                <InputLabel id="demo-select-small">Type</InputLabel>
                <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    defaultValue={page == "home" ? subsType : widgetObj?.subs_type}
                    value={subsType}
                    label="Type"
                    onChange={(e) => {setSubsType(e.target.value)}}
                    MenuProps={{
                        style: {zIndex: 35001},
                        disableScrollLock: true,
                    }}
                    fullWidth
                >
                    <MenuItem value="">
                    <em>Select Type</em>
                    </MenuItem>
                    <MenuItem value={"Days"}>Number of Days</MenuItem>
                    <MenuItem value={"Hits"}>Number of Hits</MenuItem>
                </Select>
            </FormControl>

            <div className='popup_row'>
                <div className='input_container'>
                    <input type="text" placeholder='#' defaultValue={page == "home" ? wtCount : widgetObj?.total_type} value={wtCount} onChange={(e) => {setWtCount(e.target.value);}}/> {subsType}
                </div>
                <span className='pp_price'>₹ {wtPrice} </span>
            </div>

            <div className='popup_row'>
                <span className='pp_subStatement'>{"Subscription for " + wtCount + " " + subsType}</span>
                {page == "home" ?
                <button className='popup_ATC' onClick={() => addToCart()}>Add to Cart</button>
                :
                <button className='popup_ATC' onClick={() => editWidget()}>Update Widget</button>
                }
            </div>

      </div>
    )
}

export default WdetailsPopup