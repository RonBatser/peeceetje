/*
 * this file contains all routes regarding the inventory
 */

const myPackages = require("../util/packages");
const userFunctions = require("../util/usersFunctions");
const productFunctions = require("../util/productsFunctions");
const showPages = require("../util/showPages");
const authentication = require("../util/authentication");
const jsonParser = myPackages.bodyParser.json();

module.exports = function (app) {
    app.get(["/Inventaris", "/inventaris"], function (req, res) {
        authentication.checkUserPrivilege(req, res, "barman", showPages.showInventaris);
    });
    app.post(["/Inventaris", "/inventaris"], jsonParser, function (req, res) {
        authentication.checkUserPrivilege(req, res, "barman", productFunctions.updateInventaris);
    });
    app.post(["/Inventaris/Delete", "/inventaris/delete", "/Inventaris/delete", "/inventaris/Delete"], function (req, res) {
        userFunctions.getCurrentUser(req, res, function () {
            productFunctions.deleteProduct(req, res);
        });
    });
};
