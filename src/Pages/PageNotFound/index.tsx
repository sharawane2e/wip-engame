import React, { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import Page404 from "../../Assets/images/404-error.svg";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useDispatch } from 'react-redux';
import { setEmailDetails } from '../../redux/EmailProcessRedux/emailAction';

function PageNotFound() {

  const page = window.location.pathname;
  let navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let pathSplit = page.split("/");
    console.log("pathSplit", pathSplit)

    if(pathSplit.includes("emailverify")){

      let dispatchObj = {
        "isEmailRedirect": true,
        "accessToken": pathSplit[2]
      }

      dispatch(setEmailDetails(dispatchObj));
      navigate("/");
    }

  },[])


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