
// a library script containing a function that makes api calls

const apiCall = (route, method = "GET", data = {}, afterwards = null, reload = false) => {
    data.sessid = getCookie("sessid");
    fetch("/api/" + route, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then((res, error) => {
        if (error){
            console.error(error);
        } else {
            return res.json();
        }
    })
    .then(data => {
        if (afterwards){
            afterwards(data);
        } else if (reload){
            reloadPage();
        }
    });
};
