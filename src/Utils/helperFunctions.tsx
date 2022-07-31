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