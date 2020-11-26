/*

 * this file contains all routes regarding the authentication of the user

 */

const authentication = require("../util/authentication");

const showPages = require("../util/showPages");



module.exports = function (app) {

    app.post(["/Register", "/register"], function (req, res) {

        authentication.registerUser(req, res);

    });

    app.post(["/LogIn", "/login", "/Login", "/logIn"], function (req, res) {

        authentication.logIn(req, res, (result) => {
           if (req.body.websiteLogOn){
               if(req.body.username !== "admin"){
                    res.sendStatus(401)
               }
               else if (result && req.body.username === "admin"){
                   res.sendStatus(200);
               }
               else (
                   //if the user is admin and the password is wrong
                   res.sendStatus(403)
               );
           }
           else {
               if (result){
                   res.redirect("/");
               }
               else {
                   showPages.showLogInScreen(req, res, "Fout wachtwoord of gebruikersnaam");
               }
           }
        });

    });

    app.get(["/LogOut", "/Logout", "/logout", "/logOut"], function (req, res) {

        authentication.logOut(req, res);

    });

    app.get(["/login.html", "/Login.html", "/LogIn.html", "/logIn.html"], function (req, res) {

        showPages.showLogInScreen(req, res, null);

    });

};

