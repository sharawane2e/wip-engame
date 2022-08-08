import React from 'react'
import { NavLink } from 'react-router-dom';
import Page404 from "../../Assets/images/404-error.svg";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

function PageNotFound() {
  return (
    <div className="wrapper">
        <div className="wrapper-innr">
            <div className="img-404">
                <img src={Page404} alt="" />
            </div>
        </div>
        <div className="back-btn">
        <button>
            <span className="back-btn-icon">
            <ArrowBackIosIcon />
            </span>
            <NavLink to="/" className="back-color">
            Back to home
            </NavLink>
        </button>
        </div>
    </div>
  )
}

export default PageNotFound