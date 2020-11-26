/*
 * This file contains all npm packages that are used in this project
 */

module.exports = {
    //basic packages
    createError: require("http-errors"),
    express: require("express"),
    path: require("path"),
    cookieParser: require("cookie-parser"),
    logger: require("morgan"),
    tools: require("./tools"),

    //extra packages
    HTTP: require("http"),
    session: require("express-session"),
    mysql: require("mysql"),
    bcrypt: require("bcryptjs"),
    QRCode: require("qrcode"),
    bodyParser: require("body-parser"),
    assert: require("assert"),
    fetch: require("fetch"),
    cors: require("cors"),
    nodemailer: require("nodemailer")
};
