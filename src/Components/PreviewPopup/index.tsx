import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import "./PreviewPopup.scss";
import React from 'react'
import axios from 'axios';

type CustomPopupProps = {
    widgetObj: any;
    clientkey: any;
    setShowPreviewPopup: any;
};

function PreviewPopup({widgetObj, clientkey, setShowPreviewPopup}: CustomPopupProps) {

    const hitCountAPI = () => {
        let obj = {
            "clientkey" : clientkey
        }
        axios.post("http://localhost:5000/products/subscription/hitcount", obj)
        .then(x => console.log(x.data))
    }

    return (
        <>
            <div className='popup_container'>
                <div className='popup_box'>
                    <div className='popup_header'>
                        <div className='header_text'>Widget Preview</div> 
                        <div className='closebutton'>
                        <IconButton onClick={() => setShowPreviewPopup(false)}>
                            <CloseIcon/>
                        </IconButton>
                        </div>
                    </div>
                    <div className='popup_body'>
                        <div className='Widet_Preview_Canvas' onClick={() => hitCountAPI()}></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PreviewPopup