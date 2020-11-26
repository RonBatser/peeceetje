let mysql = require("mysql");
let config = {
    host: "eu-cdbr-west-02.cleardb.net",
    port: 3306,
    database: "heroku_ea021ad9b3e8665",
    user: "b787d34541d8fd",
    password: "f184ebb3"
};


let connection = mysql.createConnection(config);

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected");
});

module.exports = {
    getAllMembers,
    deleteMemberById,
    addMember
};


// Member queries
let getAllMembersQuery = "select * from leden"
let insertMemberQuery = "insert into leden (naam,img,beschrijving) values (?,?,?)"
let deleteMemberByIdQuery = "delete from leden where id=?"

function getAllMembers(cb) {
    let members = [];
    connection.query(getAllMembersQuery, (err, rows) => {
        if (err) throw err;
        rows.forEach(row => {
            members.push(row);
        });
        cb(members)
    })
}

function addMember(values,cb){
    console.log("Name:" + values["name"]);
    connection.query(insertMemberQuery,[values["name"],values["img"],values["description"]], (err) => {
        if (err) throw err;
        cb(200);
    })
}

function deleteMemberById(id,cb) {
    connection.query(deleteMemberByIdQuery, [parseInt(id)], (err) => {
        if (err) throw err;
        cb(200);
    })

}