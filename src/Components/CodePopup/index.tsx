import { IconButton } from '@mui/material'
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import "../CustomPopup/CustomPopup.scss";
import { CopyBlock, dracula, github } from "react-code-blocks";

type CustomPopupProps = {
    widgetObj: any;
    setShowCodePopup: any;
};

function CodePopup({widgetObj, setShowCodePopup}: CustomPopupProps) {

    console.log(widgetObj)

    return (
        <>
            <div className='popup_container'>
                <div className='popup_box'>
                    <div className='popup_header'>
                        <div className='header_text'>Widget Code</div> 
                        <div className='closebutton'>
                        <IconButton onClick={() => setShowCodePopup(false)}>
                            <CloseIcon/>
                        </IconButton>
                        </div>
                    </div>
                    <div className='popup_body'>

                    {/* <div className='popup_row'>
                        <div className='input_container'>
                        </div>
                        <span className='pp_price'>₹ {"wtPrice"} </span>
                    </div> */}

                    <div className='textarea_container'>

                    </div>

                    <textarea disabled>{widgetObj.widget_embed_code}</textarea>


                    {/* <CopyBlock
                        text={widgetObj.widget_embed_code}
                        language={"javascript"}
                        showLineNumbers={true}
                        startingLineNumber={1}
                        wrapLines={false}
                        theme={github}
                        fontSize={"10px"}
                    /> */}


                    </div>
                </div>
            </div>
        </>
    )
}

export default CodePopup