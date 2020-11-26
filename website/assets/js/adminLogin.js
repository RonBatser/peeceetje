"use strict";

document.addEventListener("DOMContentLoaded", init);

function init() {
     document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=./admin.html";
    document.getElementById("AdminLogin").addEventListener("click", (e) => {
        getLoginData(e);
    });

}

function getLoginData(e) {
    e.preventDefault();
    console.log("trying to login");
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    console.log(username, password);

    let data = {
        username: `${username}`,
        password: `${password}`,
        websiteLogOn: true
    };
    let config = {
        method: 'POST',
        headers: {
            'Content-Type': "application/json",
        },
        body: JSON.stringify(data)
    };

    //! TODO: make sure to change the fetch address before release onto the server!! ==> https://app.peeceetje.be:8443/login
    fetch("https://localhost:8443/login", config)
        .then(
            res => {
                switch (res.status) {
                    case 200:
                           document.cookie = "user=admin; path=\./admin.html";
                            window.location = "admin.html";
                        break;
                    case 401:
                            window.location = "401.html";
                        break;
                    case 403:
                        formError("username or password is wrong");
                        break;
                    case 500:
                        formError("internal server error");
                        break;
                    default:
                        formError("something went wrong");
                        break;
                }
            }
        );
}

function formError(message) {
    document.getElementById("form_error").innerHTML = message;
}
