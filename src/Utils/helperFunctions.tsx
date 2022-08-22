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

    return formattedToday; // returns date in DD/MM/YY Format !
}

export const getDateDifference = (start:any, end:any) => {

    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

    let startSplit = start.split("/");
    let endSplit = end.split("/");

    const firstDate:any = new Date(startSplit[2], startSplit[1], startSplit[0]);
    const secondDate:any = new Date(endSplit[2], endSplit[1], endSplit[0]);

    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

    return diffDays;
}

export const getToalDaysLeft = (daysCount:any, startDate:any) => {
    let date_diff = getDateDifference(startDate, getDateInFormat());
    console.log("date_diff", date_diff);
    return (daysCount - date_diff);
}

// export const getToalDaysLeft = (daysCount:any, startDate:any) => {
//     let someDate = new Date();
//     let numberOfDaysToAdd = daysCount;
//     let result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);

//     var date1 = new Date(startDate);
//     var date2 = new Date(result);
      
//     var Difference_In_Time = date2.getTime() - date1.getTime();
//     var Difference_In_Days = (Difference_In_Time / (1000 * 3600 * 24)) - 1;

//     return Math.round(Difference_In_Days);
// }

export const playPauseWidget = (obj:any) => {
    
    return new Promise((res,rej) => {
        axios.patch("http://localhost:5000/user/pausewidget", {
            detailsObj : obj
        })
        .then(x => res(true))
        .catch(y => res(false))
    })
}

export const sendCustomMail = (context:any) => {

    let body = {
        "context" : context
    }

    return new Promise((res,rej) => {
        axios.post("http://localhost:5000/mail/sendmail", body)
        .then((x:any) => {
            res(x);
        })
        .catch((err:any) => {
            rej(err)
        })
    })

}

export const isEmailVerified = (token:any) => {
    return new Promise((res,rej) => {
        let body = {
            "token": token
        }
        axios.post("http://localhost:5000/user/findbytoken", body)
        .then((x:any) => {
            if(x.data.isEmailVerified == true){
                res(true)
            }
            else{
                res(false)
            }
        })
    })
}

export const verifyUserEmail = (token:any) => {
    return new Promise((res,rej) => {
        axios.post("http://localhost:5000/user/verifyemail/" + token)
        .then((x:any) => {
            if(x.data.isEmailVerified == true){
                res(true)
            }
            else{
                res(false)
            }
        })
    })
}