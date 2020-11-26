/*
 * This is the main file of the backend
 */

//custom requirements
const myPackages = require("./util/packages.js");
const myConfiguration = require("./util/configurations.js");
const showPages = require("./util/showPages");
const createError = require("http-errors");
const userFunctions = require("./util/usersFunctions.js");
const tests = require('./util/tests/generalTests.js');
const fs = require('fs');
const https = require('https');

//setup
const app = myPackages.express();
app.use(myPackages.cors());
app.locals.tools = myPackages.tools;
//const http = myPackages.HTTP.createServer(app);
//http.listen(8443);


 const key = fs.readFileSync('./private.key');
 const cert = fs.readFileSync('./primary.crt' );
 const options = {
   key: key,
   cert: cert
 };

 https.createServer(options, app).listen(8443);
//get connection and session
app.use(myPackages.session(myConfiguration.sessionConfig));

// view engine setup
app.set("views", myPackages.path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(myPackages.bodyParser.json());
app.use(myPackages.logger("dev"));
app.use(myPackages.express.json());
app.use(myPackages.express.urlencoded({extended: false}));
app.use(myPackages.cookieParser());
app.use(myPackages.express.static("public_html"));
app.use(myPackages.bodyParser.urlencoded({extended: true}));

//seperate route for testing, has to be commented in final release
// app.get("/tests", function(req,res){
//   tests.TestsRun(req,res);
//   res.redirect("/");
// });


//routes in /routes folder where no authentication is needed
require("./routes/eventsRoute.js")(app);
require("./routes/adminRoutes")(app);
//always checks if the user is logged in before doing anything else.
app.get("/*", function (req, res, next) {
    userFunctions.getCurrentUser(req, res, function () {
        userFunctions.ensureUserVerification(req, res, next);
    });
});

//custom route for showing the homepage
app.get(["/", "/Home", "/home"], function (req, res) {
    showPages.loadHomePage(req, res);
});

//routes declared in /routes folder where authentication is needed
require("./routes/usersRoute.js")(app);
require("./routes/authenticationRoute.js")(app);
require("./routes/cashdeskRoute.js")(app);
require("./routes/inventarisRoute.js")(app);
require("./routes/mailRoute.js")(app);
require("./routes/appSettingsRoute")(app);




// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    showPages.showError(req, res, err);
});
module.exports = app;
