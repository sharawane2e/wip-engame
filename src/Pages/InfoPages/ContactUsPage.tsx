import { Breadcrumbs, Grid, Paper, Typography } from '@mui/material'
import { Container } from '@mui/system'
import React from 'react'
import { NavLink } from 'react-router-dom'
import ContactForm from '../../Components/ContactForm'
import Footer from '../../Components/Footer'

const ContactUsPage = () => {
    return (
        <>
            <div className="StaticPage">
                <div className="bredcrum-conatiner ">
                    <div className="bredcrum-conatiner__bredcrum_inr">
                        <Container maxWidth="lg">
                            <Breadcrumbs
                            aria-label="breadcrumb"
                            className="bredcrum-conatiner__bredcrum-text"
                            >
                            <NavLink color="inherit" to="/">
                                Home
                            </NavLink>
                            <Typography
                                color="textPrimary"
                                className="bredcrum-conatiner__bredcrum-normaltext"
                            >
                                Contact us
                            </Typography>
                            </Breadcrumbs>
                        </Container>
                    </div>
                    <Container maxWidth="lg">
                    <div className="StaticPage__div">
                        <Paper elevation={0}>
                        <div className="StaticPage__div__container">
                            <Typography
                            gutterBottom
                            className="StaticPage__div__container__mainHeading"
                            >
                            Contact US
                            </Typography>
                            <Grid container spacing={3}>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                                <div className="contact-head">
                                <div className="contact-head__text">India</div>
                                <p>
                                    409, D-21 Corporate Park,
                                    <br />
                                    Dwarka, ND 110077
                                </p>
                                <div className="contact-head__text__con-info-panel">
                                    <div className="contact-head__text__con-info-panel__con-info">
                                    Phone:{" "}
                                    <a href="tel:+91 11 46109435">
                                        <span>+91 11 46109435</span>
                                    </a>
                                    </div>
                                    <div className="contact-head__text__con-info-panel__con-info">
                                    Email:{" "}
                                    <a href="mailto:info@e2eresearch.com">
                                        info@e2eresearch.com
                                    </a>
                                    </div>
                                </div>
                                </div>
                            </Grid>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                                <div className="contact-head">
                                <div className="contact-head__text">US</div>
                                <p>
                                    19 W, 34th Street Suite, 1021
                                    <br />
                                    New York, NY 10001
                                </p>
                                <div className="contact-head__text__con-info-panel">
                                    <div className="contact-head__text__con-info-panel__con-info">
                                    Phone:{" "}
                                    <a href="tel:1-917-962-0521">
                                        <span>+1-917-962-0521</span>
                                    </a>
                                    </div>
                                    <div className="contact-head__text__con-info-panel__con-info">
                                    Email:{" "}
                                    <a href="mailto:info@e2eresearch.com">
                                        info@e2eresearch.com
                                    </a>
                                    </div>
                                </div>
                                </div>
                            </Grid>
                            </Grid>
                            <div className="Info-data">
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                <div className="Info-data__wrapper">
                                    <p className="Info-data__wrapper__context-text">
                                    Let's Work Together
                                    </p>
                                    <p>We’d love to hear from you!</p>
                                </div>
                                </Grid>
                                {/* <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                                <div className="Form_container">
                                    <ContactForm
                                    contactListDetails={contactListDetails}
                                    setContactListDetails={setContactListDetails}
                                    setContactOpen={setContactOpen}
                                    />
                                </div>
                                </Grid> */}
                                {/* <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                                <div>
                                    <p className="Info-data__wrapper__context-text">Map</p>
                                    <GoogleMap locations={locations} />
                                </div>
                                </Grid> */}
                            </Grid>
                            </div>
                            {/* {contactListDetails ? (
                            <CustomPopup
                            open={isContactOpen}
                            onClose={() => setContactOpen(false)}
                            className="popup-background popup-container__iner--xl border-radius "
                            >
                            <Grid container spacing={1} className="popup-padding">
                            <Grid item xs={12} sm={12} lg={12}>
                                <h3>
                                Thank you for contacting us!
                                </h3>
                                </Grid>
                                <Grid item xs={12} sm={12} lg={12}>
                                <h1 className="StaticPage__div__container__headingStyle">
                                We Will Contact you soon!
                            </h1>
                                </Grid>
                            </Grid>
                            </CustomPopup>)
                            : (
                            ""
                            )} */}
                            
                        </div>
                        </Paper>
                    </div>
                    </Container>
                </div>
            <Footer />
            </div>
        </>
    )
}

export default ContactUsPage