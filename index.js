'use strict';
var express = require("express");
var app = express();
var path = require("path");
var exphbs = require("express-handlebars");
var bodyparser = require("body-parser");
var config = require("config");
var log = require("./modellayer/log");
var blog = require("./modellayer/blogs");
var _ = require("lodash");
app.locals.config = config.get('app.restAPIEndpoint.v1ContractPath');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, 'public')));

var hbs = exphbs.create({
    defaultLayout: 'default',
    helpers: {},
    partialsDir: ['views/partials/']
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


require("./passport/init");

// Configuring Passport
var passport = require("passport");
var expressSession = require('express-session');

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
    log.logger.error("error");
    log.logger.info("info");

    var blogs = {};

    blog.blogs(0, "all").then(function(response) {
        blogs = response.data;
        //console.log("Blogs Details : " + JSON.stringify(blogs));

        var nextIndex = 0;
        _.forEach(blogs.result, function(result) {
            nextIndex = result.index
        });

        res.render('home', {
            layout: 'default',
            title: 'Home Page',
            blogs: blogs,
            index: nextIndex
        });
    }).catch(function(err) {
        console.log(err);
        blogs = { "result": [], "count": 0 };
        res.render('home', {
            layout: 'default',
            title: 'Home Page',
            blogs: JSON.stringify(blogs),
            index: 0
        });
    });
});

var authRouter = require('./controllers/authroute');
app.use('/auth', authRouter);

app.use(function(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
        next();
        return;
    }
    res.redirect("/auth/login");
});

// let isValid = (req, res, next) => {
//     if (req.isAuthenticated()) {
//         res.locals.user = req.user;
//         console.log("valid");
//         next();
//         return;
//     } else {
//         console.log("In-valid");
//         res.redirect("/");
//         //  return;
//     }
// };

app.get('/dashboard', function(req, res) {
    res.render('dashboard', { layout: 'default', title: 'Dashboard Page' });
});

var CommonAPI = require('./modellayer/CommonAPI');
app.use('/commonapi', CommonAPI);

var userregistration = require('./controllers/userregistration');
app.use('/auth', userregistration);

app.use(function(req, res, next) {
    res.render('404error', { layout: 'default', title: '404 Page' });
});

process.on('uncaughtException', function(err) {
    log.logger.error(err);
});

var port = 2000;
app.listen(port, function() {
    console.log("Test - Server started at port " + port);
});