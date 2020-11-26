/*
 * this file contains all routes regarding the users
 */
const showPages = require("../util/showPages");
const authentication = require("../util/authentication");
const userFunctions = require("../util/usersFunctions");

module.exports = function (app) {
    app.get(["/Profile", "/profile"], function (req, res) {
        showPages.showProfile(req, res, null);
    });
    app.get("/Users", function (req, res) {
        authentication.checkUserPrivilege(req, res, "admin", userFunctions.getUsersList);
    });

    app.post(["/Users/Delete", "/Users/delete"], function (req, res) {
        userFunctions.getCurrentUser(req, res, function () {
            authentication.checkUserPrivilege(req, res, "admin", function () {
                const id = parseInt(req.body.id);
                userFunctions.deleteUser(req, res, id);
            });
        });
    });

    app.post(["/Users/Edit", "/Users/edit"], function (req, res) {
        userFunctions.getCurrentUser(req, res, function () {
            authentication.checkUserPrivilege(req, res, "admin", function () {
                console.log(req.body);
                const newUser = {
                    id: parseInt(req.body.id),
                    points: parseInt(req.body.points),
                    role: parseInt(req.body.roleId)
                };
                userFunctions.updateUsers(req, res, newUser);
            });
        });
    });

    app.post(["/ResetPassword"],function (req,res) {
        authentication.resetPassword(req,res);
    });

    app.get(["/ChangePassword", "/changepassword", "/Changepassword", "/changePassword"], function (req, res) {
        showPages.showChangePassword(req, res, null);
    });
    app.post(["/ChangePassword", "/changepassword", "/Changepassword", "/changePassword"], function (req, res) {
        userFunctions.getCurrentUser(req, res, function () {
            authentication.changePassword(req, res);
        });
    });
    app.post(["/DeleteUser", "/deleteuser", "/Deleteuser", "/deleteUser", "/deleteaccount", "/deleteAccount", "/Deleteaccount", "/deleteAccount"], function (req, res) {
        userFunctions.deleteUser(req, res, req.session.userLoggedIn.id);
    });
};
