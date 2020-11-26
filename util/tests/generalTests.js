/*
 * This file contains all tests used during the development phase of the  application
 * To use these tests, uncomment the /tests line in app.js en surf to /tests.
 */

const myPackages = require('../packages.js');
const myConfiguration = require('../configurations');
const myUserTests = require('./userTests');
const myProductTests = require('./productTests');

const Q = require("../queries");
const bcrypt = myPackages.bcrypt;
const assert = myPackages.assert;
const connection = myConfiguration.connection;

//enable the tests you want to run
function TestsRun(req, res) {
    console.log("running tests ...");
    myUserTests.testUsers();
    myProductTests.testProducts();
}


module.exports = {
    TestsRun
};
