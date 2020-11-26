/*
 * this file contains all functions used for dealing with users
 */

const myConfiguration = require("./configurations");
const showPages = require("./showPages");
const connection = myConfiguration.connection;
const Q = require("./queries");

//this function updates the points for the user
function updateUserPoints(newUser) {
    connection.query(Q.UPDATE_USER_POINTS, [newUser.points, newUser.id], function (err, result) {
        console.log(err);
    });

}

//this functions adds x points to the user
function addPoints(username, points) {
    connection.query(Q.ADD_POINTS, [points, username], function (err, res) {
        console.log(res);
    });
}

//applies the changes done by the admin to the users.
//updates their role and/or points
function updateUsers(req, res, newUser) {
    console.log(newUser);
    if (newUser.role !== undefined) {
        connection.query(Q.UPDATE_USER_ROLE, [newUser.role, newUser.id], function (err, result) {
            console.log(err);
        });
    }
    if (newUser.points !== undefined) {
        updateUserPoints(newUser);
    }
    res.redirect("/Users");
}


//deletes all data that is known for the user
function deleteUser(req, res, id) {
    connection.query(Q.REMOVE_USER, [id], function (err, result) {
        console.log(err);
        if (id === req.session.userLoggedIn.id) {
            req.session.userLoggedIn = null;
            res.redirect("/");
        } else {
            res.redirect("/users");
        }
    });
}

//returns all user information
function getUsersList(req, res) {
    connection.query(Q.GET_ALL_USERS_AND_ALL_ROLES, [], function (err, result, fields) {
        console.log(result);
        const users = result[1];

        res.render("userOverview.ejs", {
            users: users,
            roles: result[0]
        });

    });

}

//gives all information for one user
function getUserInfo(req, res, next) {
    connection.query(Q.GET_USER_INFO, [req.session.userLoggedIn.id], function (err, result) {
        console.log(err);
        console.log(result);
        if (result === undefined) {
            setTimeout(function () {
                getUserInfo(req, res, next);
            }, 2000);

        } else {
            req.session.userLoggedIn.firstname = result[0].voornaam;
            req.session.userLoggedIn.lastname = result[0].familienaam;
            req.session.userLoggedIn.username = result[0].username;
            req.session.userLoggedIn.points = result[0].punten;
            req.session.userLoggedIn.lastActive = result[0].lastactive;
            req.session.userLoggedIn.birthdate = result[0].geboortedatum;
            req.session.userLoggedIn.numberOfVisits = result[0].visits;
            req.session.userLoggedIn.role = result[0].rolnaam;
            res.locals.currentUser = req.session.userLoggedIn;
            console.log(req.session.userLoggedIn);
            res.locals.currentUser = req.session.userLoggedIn;
            next();
        }

    });
}

//gives information for the current user
function getCurrentUser(req, res, next) {
    if (req.originalUrl === "/LogOut") {
        next();
    } else if (req.session.userLoggedIn !== undefined && req.session.userLoggedIn !== null) {
        console.log("getCurrentUser");
        console.log(req.session.userLoggedIn);
        getUserInfo(req, res, next);

    } else {
        next();
    }
}

//checks if the user is logged in, this function is used in all routes
function ensureUserVerification(req, res, next) {
    //check if the user is identified
    console.log(req.originalUrl);
    if (req.originalUrl === "/FacebookEvents") {
        next();
    } else {
        if (req.session.userLoggedIn !== undefined && req.session.userLoggedIn !== null) {
            if (req.originalUrl === "/LogIn" || req.originalUrl === "/Register") {
                res.redirect("/");
            } else {
                next();
            }
        } else{
            showPages.showLogInScreen(req, res, null);
          }
    }
}

//update the database with the new recent visit
function logVisit(req, res) {
    connection.query(Q.UPDATE_VISIT_USER, [new Date(), req.session.userLoggedIn.id], function (err, result) {
        console.log(err);
    });
}

//get the points for the given user and use them in the callbackfuntion
function getUserPoints(username, next) {
    connection.query(Q.GET_USER_POINTS, [username], function (err, result) {
        //console.log(result);
        next(result[0].punten);
    });
}

module.exports = {
    updateUserPoints,
    updateUsers,
    addPoints,
    deleteUser,
    getUsersList,
    getUserInfo,
    getCurrentUser,
    logVisit,
    ensureUserVerification,
    getUserPoints
};
