const mail = require("../util/mail");

module.exports = function (app) {
    app.post(["/mail", "/Mail"], function (req, res) {
        mail.mail(req, res);
    });
};
