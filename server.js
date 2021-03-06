// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var passport = require('passport');
var flash    = require('connect-flash');
var exphbs = require("express-handlebars");
var methodOverride = require("method-override");
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var fileUpload = require('express-fileupload');
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Requiring our models for syncing
//var db = require("./models");


require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars"); // set up ejs for templating
app.use(express.static(__dirname + '/public'));
// required for passport
app.use(session({ secret: 'anything' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

const db = require('./models/index.js')
// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

// Static directory
 app.use(express.static("./public"));

require('./routes/user-api-route.js')(app, passport); // load our routes and pass in our app and fully configured passport
// require("./routes/photo-upload-routes.js")(app);
 require("./routes/poststream-routes.js")(app);

db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
})
