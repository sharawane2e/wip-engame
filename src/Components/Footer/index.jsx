import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import Divider from '@mui/material/Divider';



const Footer = (props) => {
  useEffect(() =>{
    window.scrollTo(0, 0);
  },[])
  return (
    <>
      <div className="footer">
        <Grid container className="footer__gridmain">
          <Grid
            item
            xl={12}
            lg={12}
            md={12}
            sm={12}
            xs={12}
            className="footer__gridmain__gridInnerChild"
          >
            <Typography
              variant="div"
              component="div"
              className="footer__gridmain__gridInnerChild__atag"
            >
              <Link to="/privacy-policy">Privacy Policy</Link>{" "}
            </Typography>
            <Typography
              variant="div"
              component="div"
              className="footer__gridmain__gridInnerChild__atag"
            >
              {" "}
              <Link to="/refund-policy">Refund Policy</Link>
            </Typography>
            <Typography
              variant="div"
              component="div"
              className="footer__gridmain__gridInnerChild__atag"
            >
              <Link to="/terms-condition">Terms & Condition</Link>
            </Typography>
            <Typography
              variant="div"
              component="div"
              className="footer__gridmain__gridInnerChild__atag"
            >
              {" "}
              <Link to="/contact-us">Contact US</Link>
            </Typography>
          </Grid>
          <Divider  className="footer__divider"/>
          <Grid
            item
            xl={12}
            lg={12}
            md={12}
            sm={12}
            xs={12}
            className="footer__gridmain__rightChild"
          >
            <Typography variant="p" gutterBottom className="copyright-text">
              Copyright &copy; 2021 E2E Research Services Pvt. Ltd.
            </Typography>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Footer;
