/*
 * This file contains all configuration object used for this project.
 * It contains objects for the session and the database.
 */
const myPackages = require("./packages.js");

//the configuration object for the session
const sessionConfig = {
    key: "PeeceetjeSession",
    secret: "n4h3AV9WTxi7IqKg75KZ",
    resave: true,
    saveUninitialized: false
};

//The configuration used for the mysql database connection
const mysqlConfig = {
    connectionLimit: 5,
    host: "eu-cdbr-west-02.cleardb.net",//"localhost",//"eu-cdbr-west-02.cleardb.net",
    port: 3306,
    database: "heroku_ea021ad9b3e8665",//"peecee1q_peeceetjeApp",//"heroku_ea021ad9b3e8665",
    user: "b787d34541d8fd",//"peecee1q_b787d34541d8fd",//"b787d34541d8fd",
    password: "f184ebb3",//"Nc^OAbnq7Lvo84",//"f184ebb3",
    multipleStatements: true
};

//create a pool for the database, can be used in all files.
let connection = myPackages.mysql.createPool(mysqlConfig);

module.exports = {
    sessionConfig,
    mysqlConfig,
    connection
};
