/*
 * this file contains all routes regarding the cashdesk
 */
const productFunctions = require("../util/productsFunctions");
const showPages = require("../util/showPages");
const authentication = require("../util/authentication");

module.exports = function (app) {
    app.post(["/api/Order", "/Api/Order", "/api/order", "/Api/Order"], function (req, res) {
        productFunctions.executeOrder(req, res);
    });
    app.post(["/api/GetFreeItems", "/Api/getfreeitems", "/api/getfreeitems", "/Api/GetFreeItems"], function (req, res) {
        productFunctions.getFreeItem(req, res);
    });

    app.get(["/CashDesk", "/cashdesk", "/Cashdesk", "/cashDesk"], function (req, res) {
        authentication.checkUserPrivilege(req, res, "barman", showPages.showCashDesk);
    });
};
