import { getCookie } from "./utils.module.js";

// a library script containing a function that makes api calls
export default async function makeApiCall(data){
    data.body = data.body || {};
    if (getCookie("sessid")){
        data.body.sessid = getCookie("sessid");
    }
    let url;
    if (data.external){
        url = data.route
    } else {
        url = "/api/" + data.route;
    }
    const res = await fetch(url, {
        method: data.method || "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data.body)
    });
    data = await res.json();
    return data;
};
