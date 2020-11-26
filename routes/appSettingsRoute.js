const fs = require("file-system");
const read = require("read-file");
const authentication = require("../util/authentication");

function readSettings(req, res) {
    read("./appsettings/settings.json", {encoding: "utf8"}, function (err, buf) {
        let string = JSON.parse(buf.toString());

        res.render("appsettings.ejs", {token: string.token});

    });

}

function writeSettingsChanges(req, res) {
    let json = {"token": req.body.token};
    json = JSON.stringify(json);
    fs.writeFile("./appsettings/settings.json", json, function (err) {
        res.redirect("/appsettings");
    });
}


module.exports = function (app) {
    app.get("/appsettings", function (req, res) {
        authentication.checkUserPrivilege(req, res, "admin", readSettings)
    });

    app.post("/token", function (req, res) {
        authentication.checkUserPrivilege(req, res, "admin", writeSettingsChanges)
    });

};