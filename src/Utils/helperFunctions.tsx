import axios from "axios";

const baseUrl = "http://localhost:5000/";

const instance = axios.create({
    baseURL: process.env.BaseUrl,
});

export const ApiRequest = async (url:any, method:any ,data?:any) => {
    let fullurl = baseUrl + url;
    const response = await instance(fullurl, {method, data});
    return response.data;
}

export const getDateInFormat = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm:any = today.getMonth() + 1; // Months start at 0!
    let dd:any = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = dd + '/' + mm + '/' + yyyy;

    return formattedToday;
}

export const getDateDifference = (start:any, end:any) => {
    var date1 = new Date(start);
    var date2 = new Date(end);
      
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return Difference_In_Days;
}

export const getToalDaysLeft = (daysCount:any, startDate:any) => {
    let someDate = new Date();
    let numberOfDaysToAdd = daysCount;
    let result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);

    var date1 = new Date(startDate);
    var date2 = new Date(result);
      
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = (Difference_In_Time / (1000 * 3600 * 24)) - 1;

    return Math.round(Difference_In_Days);
}

export const playPauseWidget = (obj:any) => {
    
    return new Promise((res,rej) => {
        axios.patch("http://localhost:5000/user/pausewidget", {
            detailsObj : obj
        })
        .then(x => res(true))
    })
}