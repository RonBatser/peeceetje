let db = require('./dbRoutes');
let fs = require('fs');

module.exports = function (app) {

    app.get("/readDescription", function (req, res) {
        fs.readFile('./website-content/jeugdhuis-description.json', (err, data) => {
            if (err) throw err;
            let description = JSON.parse(data);
            res.json(description);
        });
    });

    app.post("/changeDescription", function (req, res, err) {
        console.log(req["body"]);
        let data = JSON.stringify(req["body"]);
        fs.writeFileSync('./website-content/jeugdhuis-description.json', data)

    });

    app.get("/readAppDescription", function (req, res) {
        fs.readFile('./website-content/app-description.json', (err, data) => {
            if (err) throw err;
            let student = JSON.parse(data);
            res.json(student);
            console.log(student);
        });
    });

    app.post("/changeAppDescription", function (req, res, err) {
        console.log(req["body"]);
        let data = JSON.stringify(req["body"]);
        fs.writeFileSync('./website-content/app-description.json', data)

    });

    app.get("/readMembers", function (req, res) {
        db.getAllMembers(result => {
            res.json(result);
        })
    });

    app.post("/addMember", function (req,res,err) {
        let memberToAdd = req["body"];

        console.log("member: " + memberToAdd);

        db.addMember(memberToAdd,result => {
            res.json(result);
        })

    });

    app.post("/deleteMember", function (req, res, err) {
        let memberId = req["body"];


        db.deleteMemberById(parseInt(memberId["id"]),result => {
            res.json(result);
        })

    });

    app.get("/readAboutUs", function (req,res,err){
        fs.readFile('./website-content/about-us-description.json', (err, data) => {
            if (err) throw err;
            let description = JSON.parse(data);
            res.json(description);
        });
    });

    app.post("/changeAboutUs",function(req,res,err){
        let data = JSON.stringify(req["body"]);
        fs.writeFileSync('./website-content/about-us-description.json', data)
    });
};