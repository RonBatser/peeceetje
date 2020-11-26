/*
 * This file contains all functions for showing the different pages
 * It also contains the functions for registering en logging in and out
 */

const myPackages = require("./packages");
const myConfiguration = require("./configurations");
const connection = myConfiguration.connection;
const Q = require("./queries");
const read = require("read-file");

//Shows the login page
function showLogInScreen(req, res, message) {
    res.render("logInPage.ejs", {
        error: message
    });
}

//shows the custom error page
function showError(req, res, err) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
}

//shows the page with the user information
function showProfile(req, res, message) {
    console.log(`id: ${req.session.userLoggedIn.id}`);
    connection.query(Q.GET_USER_INFO, [req.session.userLoggedIn.id], function (err, result) {
        console.log(err);
        if (result !== null && result.length > 0) {
            res.render("profile.ejs", {
                profile: result,
                message: message
            });
        } else {
            showError(req, res, err);
        }
    });
}

//shows the cashdesk page
function showCashDesk(req, res) {

    connection.query(Q.GET_INVENTARIS, [], function (err, result) {
        if (err === null) {
            res.render("CashDesk.ejs", {
                products: result
            });
        } else {
            showError(req, res, err);
        }
    });

}

//shows the inventory page
function showInventaris(req, res) {

    connection.query(Q.GET_INVENTARIS, [], function (err, result) {
        if (err === null) {
            res.render("inventaris.ejs", {
                inventaris: result
            });
        } else {
            showError(req, res, err);
        }
    });

}

//load the homepage
function loadHomePage(req, res) {
    //TestsRun(req,res);
    connection.query(Q.GET_USER_INFO, [req.session.userLoggedIn.id], function (err, result) {
        myPackages.QRCode.toDataURL(req.session.userLoggedIn.username, function (err, url) {
            const punten = result[0].punten;
            req.session.userLoggedIn.role = result[0].rolnaam;
            req.session.isUserLoggedIn = true;
            res.render("index.ejs", {
                title: "home",
                qr: url,
                saldo: punten,
                username: req.session.userLoggedIn.username
            });
        });
    });
}

//load the events page
function loadEventsPage(req, res) {
    read("./appsettings/settings.json", {encoding: "utf8"}, function (err, buf) {
        let string = JSON.parse(buf.toString());
        const pageId = "180681725447301";

        const token = string.token;
        const apiUrl = "https://graph.facebook.com/" + pageId + "/events?oauth_token=" + token;
        const fetchUrl = require("fetch").fetchUrl;
        fetchUrl(apiUrl, function (error, meta, body) {
            const data = JSON.parse(body.toString());
            res.json(data.data);
        });
    });

}

//load location from facebook
function loadLocation(req, res) {
    read("./appsettings/settings.json", {encoding: "utf8"}, function (err, buf) {
        let string = JSON.parse(buf.toString());


        const token = string.token;
        const pageId = "180681725447301";
	console.log(token);
        const apiUrl = "https://graph.facebook.com/v2.11/" + pageId + "?fields=location,phone&oauth_token=" + token;
        const fetchUrl = require("fetch").fetchUrl;
        fetchUrl(apiUrl, function (error, meta, body) {
            res.json(body.toString());
		console.log(body.toString());
        });
    });


}

//show the page that lets you change your password
function showChangePassword(req, res, message) {
    res.render("ChangePassword.ejs", {
        message: message
    });
}

module.exports = {
    showChangePassword,
    showLogInScreen,
    showError,
    showProfile,
    showCashDesk,
    showInventaris,
    loadHomePage,
    loadEventsPage,
    loadLocation
};
