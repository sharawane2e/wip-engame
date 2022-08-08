import { Breadcrumbs, Grid, Paper, Tooltip, Typography } from '@mui/material';
import { Container } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../../Components/Footer';
import { crypt } from '../../Utils/EncryptFunctions';
// import { CopyToClipboard } from "react-copy-to-clipboard";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Switch from '@mui/material/Switch';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import { NavLink } from 'react-router-dom';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import GetAppIcon from '@mui/icons-material/GetApp';
// import { withStyles } from '@mui/styles';
import LinearProgress from '@mui/material/LinearProgress';
import { getDateInFormat, getToalDaysLeft, playPauseWidget } from '../../Utils/helperFunctions';
import { useSnackbar } from 'notistack';
import { setReduxUser } from '../../Utils/userFunctions';
import { setUserDetails } from '../../redux/UserRedux/userAction';

// const BorderLinearProgress = withStyles((theme:any) => ({
//     root: {
//       height: 6,
//       borderRadius: 6,
//     },
//     colorPrimary: {
//       backgroundColor:
//         theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
//     },
//     bar: {
//       borderRadius: 5,
//     },
//   }))(LinearProgress);


function MyWidgets() {

    const [showLoader, setShowLoader] = useState(false);
    const [purchasedWidArr, setPurchasedWidArr] = useState<any>([]);
    const [showCodePopup, setShowCodePopup] = useState(false);
    const [CPWidgetObj, setCPWidgetObj] = useState({});
    const [isShow, setShow] = useState([]);
    const [is_renew, setRenew] = useState(false);
    const [widgetList, setWidgetList] = useState([]);
    const [productShow, setProductShow] = useState([]);
    const token = useSelector((state:any) => state.user.userDetails.accessToken);
    const [isPausePopup, setPausePopup] = useState(false); // Popup on play and Pause
    const [PlayPauseValue, setPlayPauseValue] = useState("");
    const [filter, setFilter] = useState("all");
    const [isPurchaseEmpty, setIsPurchaseEmpty] = useState();
    const [sucess, setSucess] = useState("Copy");

    const storeData = useSelector((data:any) => data);
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        filterWidgets();
    }, [filter])

    function genSubscriptionKey(widObj:any){
        let key = ""
        key = storeData?.user?.userDetails?.accessToken + "*" + widObj.id + "*" + "hits" + "*" + "true";
        let encrypt = crypt("saltise2eresearch", key)
        return encrypt;
    }

    const handleCodePreview = (card:any) => {
        let cardObj = JSON.parse(JSON.stringify(card));
        let genKey = genSubscriptionKey(card);
        cardObj.widget_embed_code = cardObj?.widget_embed_code?.replace('\"*secratekey*\"', '\"' + genKey + '\"')
        setCPWidgetObj(cardObj); 
        setShowCodePopup(true); 
    }

    const getConsumptionValue = (item:any) => {
        let val = 0;
        if(item?.remaining_value && item?.plan.plan_value){
            val = (item?.remaining_value * 100) / item?.plan.plan_value;
        }
        else{
           val = 50; 
        }
        return val;
    }

    const BASE_URL = "https://apiengame.e2eresearch.com";

    const getSummaryStatement = (widObj:any) => {

        let subsType:any = widObj?.details?.subs_type;
        let str:any = "";

        if(subsType == "Hits"){
            str =  (widObj.details.total_count - widObj.widget.hitcount) + " Hits left";
        }
        else{
            str = getToalDaysLeft(widObj.details.total_count, getDateInFormat()) + " Days left";
        }
        return str;
    }

    const filterWidgets = () => {
        let WidgetsArr = storeData?.user?.userDetails?.purchasedWidgets.slice();
        let filteredArr = [];

        if(filter == "all"){
            setPurchasedWidArr(WidgetsArr);
        }
        else if(filter == "active"){
            filteredArr = storeData?.user?.userDetails?.purchasedWidgets.filter((x:any) => x.details.is_paused == false);
            setPurchasedWidArr(filteredArr);
        }
        else if(filter == "expired"){
            setPurchasedWidArr([]);
        }
        else if(filter == "paused"){
            filteredArr = storeData?.user?.userDetails?.purchasedWidgets.filter((x:any) => x.details.is_paused == true);
            setPurchasedWidArr(filteredArr);
        }
        else{
            setPurchasedWidArr([]);
        }
    }

    const handlePlayPause = (widgetId:any, is_paused:any) => {
        let obj = {
            "username": storeData.user.userDetails.username,
            "widgetId" : widgetId,
            "is_paused": !is_paused 
        }
        playPauseWidget(obj)
        .then(x => {
            console.log("changed");
            setReduxUser(storeData.user.userDetails.username)
            .then(data => {
              dispatch(setUserDetails(data))
            });
            if(!is_paused){
                enqueueSnackbar(`Widget has been paused !`, { variant: "warning" });
            }
            else{
                enqueueSnackbar(`Widget has been enabled !`, { variant: "success" });
            }
        })
    }

    return (
        <>
            <div className="purchased-tool bredcrum-conatiner">
                <div className="bredcrum-conatiner__bredcrum_inr ">
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
                            component="div"
                            className="bredcrum-conatiner__bredcrum-normaltext"
                        >
                            My Widgets
                        </Typography>
                        </Breadcrumbs>
                    </Container>
                </div>

                {showLoader && storeData?.user?.userDetails?.purchasedWidgets?.length == 0 ? 
                    (
                        <>
                            <div className='cart_loader'>
                                    Loading....
                            </div>
                        </>
                    )
                    : 
                    (
                        <Container
                            maxWidth="lg"
                            className="purchased-tool__container  margin-top-174 shopping-cart-data"
                        >
                            <Grid container spacing={3}>
                                <Grid
                                    item
                                    xs={12}
                                    className="purchased-tool__hedding purchased-tool__borderdata"
                                >
                                    <Typography
                                    color="textPrimary"
                                    component="div"
                                    className="hedding-text"
                                    >
                                    My Widgets
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={3} className="purchased-tool__filterTabs">
                                <Grid
                                    item
                                    xs={12}
                                    className="purchased-tool__hedding purchased-tool__tabing"
                                >
                                    <Typography
                                    color="textPrimary"
                                    component="div"
                                    className={`tab--button border-radius ${
                                        filter == "all" ? "tab--active" : ""
                                    } `}
                                    onClick={() => setFilter("all")}
                                    >
                                    All
                                    </Typography>
                                    <Typography
                                    color="textPrimary"
                                    component="div"
                                    className={`tab--button border-radius ${
                                        filter == "active" ? "tab--active" : ""
                                    } `}
                                    onClick={() => setFilter("active")}
                                    >
                                    Active Only
                                    </Typography>
                                    <Typography
                                    color="textPrimary"
                                    component="div"
                                    className={`tab--button border-radius ${
                                        filter == "expiresoon" ? "tab--active" : ""
                                    } `}
                                    onClick={() => setFilter("expiresoon")}
                                    >
                                    Expiring Soon
                                    </Typography>
                                    <Typography
                                    color="textPrimary"
                                    component="div"
                                    className={`tab--button border-radius ${
                                        filter == "expired" ? "tab--active" : ""
                                    } `}
                                    onClick={() => setFilter("expired")}
                                    >
                                    Expired
                                    </Typography>
                                    <Typography
                                    color="textPrimary"
                                    component="div"
                                    className={`tab--button border-radius ${
                                        filter == "paused" ? "tab--active" : ""
                                    } `}
                                    onClick={() => setFilter("paused")}
                                    >
                                    Paused
                                    </Typography>
                                    <Typography
                                    color="textPrimary"
                                    component="div"
                                    className={`tab--button border-radius ${
                                        filter == "days" ? "tab--active" : ""
                                    } `}
                                    onClick={() => setFilter("days")}
                                    >
                                    Days Subs.
                                    </Typography>
                                    <Typography
                                    color="textPrimary"
                                    component="div"
                                    className={`tab--button border-radius ${
                                        filter == "hits" ? "tab--active" : ""
                                    } `}
                                    onClick={() => setFilter("hits")}
                                    >
                                    Hits Subs.
                                    </Typography>
                                </Grid>
                            </Grid>
            
                            {/* {FilterData.length > 0 ? (
                            FilterData?.map((item, index) => {
                                let purchasedDateTime = new Date(item.purchase_date);
                                purchasedDateTime = purchasedDateTime.toLocaleString("en-US");
                                const purchase_date = purchasedDateTime.split(",")[0];
                                const purchase_time = purchasedDateTime.split(",")[1];
            
                                let planExpiry = new Date(item.plan_expire_date);
                                planExpiry = planExpiry.toLocaleString("en-US");
                                const planExpiry_date = planExpiry.split(",")[0];
                                const planExpiry_time = planExpiry.split(",")[1];
            
                                const ConsumptionValue =
                                (item.remaining_value * 100) / item.plan.plan_value;
            
                                return ( */}

                            {storeData?.user?.userDetails?.purchasedWidgets?.length > 0 ?
                                (
                                    purchasedWidArr.map((item:any, index:any) => (
                                    <Grid container spacing={3} key={index} className="mb-10">
                                        <Grid item xs={12}>
                                        <Paper className="purchased-tool__tool-card card-box-shadow border--colordata border-radius">
                                            <Grid container spacing={3}>
                                            <Grid
                                                item
                                                xs={12}
                                                container
                                                className="purchased-tool__tool-type-data"
                                            >
                                                <div className="purchased-tool__purchased-date">
                                                {/* <img src={checkCircle} /> */}
                                                {item?.details.is_paused ? (
                                                    <PauseCircleOutlineIcon className="fill_yellow" />
                                                ) : item.details.is_expiring_soon ? (
                                                    <TimerIcon className="fill_red" />
                                                ) : item.details.is_active ? (
                                                    <CheckCircleIcon />
                                                ) : !item.details.is_active ? (
                                                    <ErrorOutlineIcon className="fill_red" />
                                                ) : (
                                                    ""
                                                )}
                
                                                <div className="purchased-tool__date-type-text purchased-curent-text">
                                                    Purchased Date:
                                                </div>
                                                <div className="purchased-tool__dateNTime">
                                                    <div className="purchased-tool__date-type-text">
                                                    {item?.details?.purchase_date}
                                                    </div>
                                                    <div className="purchased-tool__date-type-time">
                                                    {item?.details?.purchase_time}
                                                    </div>
                                                </div>
                                                </div>
                                            </Grid>
                
                                            <Grid
                                                item
                                                xs={2}
                                                container
                                                className="purchased-tool__tool-image purchased-image"
                                            >
                                                <img
                                                alt={item.widget.name}
                                                title={item.widget.name}
                                                src={BASE_URL + item.widget.imgUrl}
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                xs={10}
                                                sm
                                                container
                                                className="purchased-tool__tool-data pb-10"
                                            >
                                                <Grid item xs={10}>
                                                <Grid item>
                                                    <Typography
                                                    component="div"
                                                    className="purchased-tool__tool-title"
                                                    >
                                                    {item.widget.name}
                                                    </Typography>
                                                    <Typography
                                                    component="div"
                                                    className="purchased-tool__tool-type display-flex"
                                                    >
                                                    <span className="subscription-type-text">
                                                        Subscription Key:
                                                    </span>
                                                    <Tooltip title={sucess} placement="top">
                                                        <div className="subscription-day margin-rightdata copy-to-clip display-flex" 
                                                        onClick={() => {navigator.clipboard.writeText(item.secrate_key)}}
                                                        >
                                                        <span
                                                            className="subscription-day margin-rightdata copy-to-clip display-flex"
                                                            // onClick={() => {
                                                            // setSucess("Copied");
                                                            // setTimeout(
                                                            //     () => setSucess("Copy"),
                                                            //     500
                                                            // );
                                                            // }}
                                                        >
                                                            {item?.secrate_key?.substr(0, 5)}
                                                            ********
                                                            <ContentCopyIcon className="subscription-day__icon" />
                                                        </span>

                                                        </div>
                                                    </Tooltip>
                                                    </Typography>
                                                    <Typography
                                                    component="div"
                                                    className="purchased-tool__tool-type display-flex"
                                                    >
                                                    <span className="subscription-type-text">
                                                        Trial Key:
                                                    </span>
                                                    <Tooltip title={sucess} placement="top">
                                                        <div className="subscription-day margin-rightdata copy-to-clip display-flex" 
                                                        onClick={() => {navigator?.clipboard?.writeText(item.secrate_key)}}
                                                        >
                                                        <span
                                                            className="subscription-day margin-rightdata copy-to-clip display-flex"
                                                            // onClick={() => {
                                                            // setSucess("Copied");
                                                            // setTimeout(
                                                            //     () => setSucess("Copy"),
                                                            //     500
                                                            // );
                                                            // }}
                                                        >
                                                            <span className="display-flex">
                                                            {item?.trial_key?.substr(0, 5)}
                                                            ********
                                                            </span>
                                                            <ContentCopyIcon className="subscription-day__icon" />
                                                        </span>
                                                        </div>
                                                    </Tooltip>
                                                    </Typography>
                                                </Grid>
                                                </Grid>
                                                <Grid item xs={2} className="grid-flex">

                                                <Tooltip title="Play / Pause" placement="top">
                                                    <Typography
                                                    component="div"
                                                    className=" border-radius switchBtn"
                                                    >
                                                    <Switch
                                                        // checked={item?.is_paused ? false : true}
                                                        // checked={true}
                                                        defaultChecked={!item?.details?.is_paused}
                                                        onChange={(e:any) => handlePlayPause(item?.widget?.id ,e.target.checked)}
                                                        // onClick={() => {
                                                        // setPausePopup(true);
                                                        // setPlayPauseValue(item);
                                                        // }}
                                                    />
                                                    </Typography>
                                                </Tooltip>

                                                <Tooltip title="Extend validity" placement="top">
                                                    <Typography
                                                    component="div"
                                                    className="extend-validity"
                                                    // onClick={() => //handleExtend(item)}
                                                    // onClick={() => {
                                                    //     setRenew(true);
                                                    //     setProductShow(item);
                                                    //     handleExtendLocal(item);
                                                    // }}
                                                    >
                                                    Extend validity
                                                    </Typography>
                                                </Tooltip>
                                                </Grid>
                
                                                <Grid
                                                item
                                                xs={12}
                                                container
                                                className="purchased-tool__tool-margin"
                                                >
                                                <Grid item xs={4}>
                                                    <Typography
                                                    component="div"
                                                    className="purchased-tool__tool-type"
                                                    >
                                                    {!item.is_paused &&
                                                    item?.plan?.plan_type == "days" ? (
                                                        <>
                                                        <span className="subscription-type-text expiry-type">
                                                            Expiry Date:
                                                        </span>
                                                        <span className=" expiry-type margin-rightdata">
                                                            {"planExpiry_date"}
                                                        </span>
                                                        </>
                                                    ) : (
                                                        ""
                                                    )}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Typography
                                                    component="div"
                                                    className="purchased-tool__tool-type align-center progress-bar"
                                                    >
                                                    <span className="subscription-type-text ">
                                                        {/* {item?.remaining_value}&nbsp;&nbsp;
                                                        {item?.details?.subs_type} left */}
                                                        {getSummaryStatement(item)}
                                                    </span>
                
                                                    {/* <BorderLinearProgress
                                                        variant="determinate"
                                                        value={getConsumptionValue(item)}
                                                        className={
                                                            
                                                            getConsumptionValue(item) > 79
                                                            ? "progress-bar progress-green"
                                                            :  getConsumptionValue(item) > 49 &&
                                                            getConsumptionValue(item) < 80
                                                            ? "progress-bar progress-yellow"
                                                            :  getConsumptionValue(item) > 19 &&
                                                            getConsumptionValue(item) < 50
                                                            ? "progress-bar progress-embeded"
                                                            : "progress-bar progress-red"
                                                        }
                                                    /> */}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6} className="grid-flex">
                                                    <div
                                                    className="purchased-tool__purchased-date purchased-tool__toggleclass show--toogle"
                                                    onClick={() => {
                                                        const currentActive:any = [...isShow];
                                                        currentActive[index] =
                                                        !currentActive[index];
                                                        setShow(currentActive);
                                                    }}
                                                    >
                                                    <span className="purchased-tool__date-type-text purchased-curent-text">
                                                        {isShow[index] ? "Show Less" : "Show More "}
                                                    </span>
                                                    <span className="purchased-tool__date-type-text">
                                                        {isShow[index] ? (
                                                        <ExpandLessIcon />
                                                        ) : (
                                                        <ExpandMoreIcon />
                                                        )}
                                                    </span>
                                                    </div>
                                                </Grid>
                                                </Grid>
                                            </Grid>
                
                                            {isShow[index] ? (
                                                <Grid
                                                item
                                                xs={12}
                                                container
                                                className="purchased-tool__tool-data accordion-margin show--accordion custom_show_more"
                                                >
                                                <Grid item xs={12} sm={6}>
                                                    <Typography component="div">
                                                    <div className="purchased-tool__purchased-date">
                                                        <span className="purchased-tool__date-type-text purchased-curent-text">
                                                        Total Amount:
                                                        </span>
                                                        <span className="purchased-tool__date-type-text bold-style">
                                                        ₹{item?.details?.price}
                                                        </span>
                                                    </div>
                                                    </Typography>
                
                                                    <Typography component="div">
                                                    <div className="purchased-tool__purchased-date">
                                                        <span className="purchased-tool__date-type-text purchased-curent-text">
                                                        Payment Method:
                                                        </span>
                                                        <span className="purchased-tool__date-type-text">
                                                        {item?.details?.payment_method}
                                                        </span>
                                                    </div>
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={6}
                                                    className="mobile__only"
                                                >
                                                    <Typography
                                                    component="div"
                                                    className="cursor--pointer purchased-tool__doenloadP"
                                                    >
                                                    DOWNLOAD
                                                    </Typography>
                                                </Grid>
                
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={6}
                                                    className="purchased-tool__expiry-date"
                                                >
                                                    <div className="desktop__only">
                                                    <Typography
                                                        component="div"
                                                        className="cursor--pointer purchased-tool__Indicator"
                                                    >
                                                        <div className="purchased-tool__purchased-date ">
                                                        <span className="purchased-tool__date-type-text purchased-curent-text"></span>
                                                        <span className="purchased-tool__date-type-text purchased-types">
                                                            DOWNLOAD
                                                        </span>
                                                        </div>
                                                    </Typography>
                                                    </div>
                                                    <div className="purchased-tool__embeded-Fdiv">
                                                    <Tooltip
                                                        title="Download Invoice"
                                                        placement="top"
                                                    >
                                                        <Typography
                                                        component="div"
                                                        className="purchased-tool__embeded-icon border-radius"
                                                        >
                                                            <ReceiptIcon fontSize="large"/>
                                                        </Typography>
                                                    </Tooltip>
                                                    </div>
                                                    <div className="purchased-tool__embeded-div">
                                                    <Tooltip
                                                        title="Consumption statement"
                                                        placement="top"
                                                    >
                                                        <Typography
                                                        component="div"
                                                        className="purchased-tool__embeded-icon border-radius"
                                                        // onClick={() =>
                                                        //     downloadConsumptionStatement(
                                                        //     item.id,
                                                        //     item.widget.name
                                                        //     )
                                                        // }
                                                        >
                                                        {/* <ConsumptionReportImg /> */}
                                                            <AnalyticsIcon fontSize="large"/>
                                                        </Typography>
                                                    </Tooltip>
                                                    </div>
                                                    <div className="purchased-tool__embeded-div">
                                                    <Tooltip title="Embeded Code" placement="top">
                                                        <Typography
                                                        component="div"
                                                        className="purchased-tool__embeded-icon border-radius"
                                                        // onClick={() =>
                                                        //     downloadfile(
                                                        //     item.widget.name,
                                                        //     item.widget.widget_embed_code
                                                        //     )
                                                        // }
                                                        >
                                                        {/* <EmbdedCodeImg /> */}
                                                            <GetAppIcon fontSize="large"/>
                                                        </Typography>
                                                    </Tooltip>
                                                    </div>
                                                </Grid>
                                                </Grid>
                                            ) : null}
                                            </Grid>
                                        </Paper>
                                        </Grid>
                                    </Grid>)
                                )
                                ) 
                                : 
                                (
                                    <>
                                        {/* <NoSearchFound img={NoresultImg} heading="No result found" /> */}
                                    </>
                                )}
                        </Container>
                    )
                }

                {/*Renew Subscription*/}
                {/* <CustomPopup
                open={is_renew}
                onClose={() => setRenew(false)}
                headerText="Extend Validity"
                footerButton={true}
                className="border-radius popup-container__iner--sm"
                >
                <SubscriptionRenew
                    updateData={productShow}
                    onClose={() => setRenew(false)}
                />
                </CustomPopup>
                <CustomPopup
                open={isPausePopup}
                className="popup-container__iner--sm border-radius loginAlert "
                >
                <Grid container spacing={4} align="center">
                    <Grid item xs={12}>
                    <img
                        className="message__img"
                        src={warning_icon}
                        alt="Registration Sucessfully"
                    />
                    <Typography component="p" className="sucess_message">
                        {PlayPauseValue.is_paused &&
                        PlayPauseValue.plan?.plan_type == "days"
                        ? ErrorMessages.DAYS_WIDGET_ON_PLAY
                        : !PlayPauseValue.is_paused &&
                            PlayPauseValue.plan?.plan_type == "days"
                        ? ErrorMessages.DAYS_WIDGET_ON_PAUSE
                        : PlayPauseValue.is_paused &&
                            PlayPauseValue.plan?.plan_type == "hits"
                        ? ErrorMessages.HITS_WIDGET_ON_PLAY
                        : ErrorMessages.HITS_WIDGET_ON_PAUSE}
                    </Typography>
                    <CustomButton
                        className="primary-button"
                        style={{ marginRight: "20px" }}
                        onClick={() =>
                        PlayNPause(PlayPauseValue.plan.id, PlayPauseValue.is_paused)
                        }
                    >
                        {PlayPauseValue.is_paused ? "Play Now" : "Pause Now"}
                    </CustomButton>
                    <CustomButton
                        className="secondary-button"
                        onClick={() => {
                        setPausePopup(false);
                        }}
                    >
                        Cancel
                    </CustomButton>
                    </Grid>
                </Grid>
                </CustomPopup> */}

                
                <Footer />
            </div>
        </>
    )
}

export default MyWidgets