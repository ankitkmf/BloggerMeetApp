'use strict';
var express = require("express");
var app = express();
var path = require("path");
var exphbs = require("express-handlebars");
var bodyparser = require("body-parser");
var config = require("config");
var log = require("./modellayer/log");
var _ = require("lodash");
app.locals.config = config.get('app.restAPIEndpoint.v1ContractPath');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'profilephoto')));

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

let authenticationMiddleware = function(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user.result[0];
        return next();
    }
    res.redirect('/');
};

let authNotRequired = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user.result[0]
    }
    next();
};

app.get('/', authNotRequired, function(req, res) {
    var blogs = {};
    var blog = require("./modellayer/blogs");
    var categoryList = blog.category;

    blog.blogs(0, "all").then(function(response) {
        blogs = response.data;

        log.logger.info("Home Page : retrieve blogs : blogs count " + blogs.count);

        var nextIndex = 0;
        _.forEach(blogs.result, function(result) {
            nextIndex = result.index
        });

        res.render('home', {
            layout: 'default',
            title: 'Home Page',
            blogs: blogs,
            index: nextIndex,
            category: categoryList
        });
    }).catch(function(err) {
        log.logger.error("Home Page : failed to retrieve blogs : error " + err);
        blogs = { "result": [], "count": 0 };
        res.render('home', {
            layout: 'default',
            title: 'Home Page',
            blogs: JSON.stringify(blogs),
            index: 0,
            category: categoryList
        });
    });
});

// app.get("/myprofile", authenticationMiddleware, function(req, res) {
//     res.render("myprofile", { layout: 'default', title: 'My Profile Page' });
// });

var myprofileroute = require('./controllers/myprofile');
app.use("/myprofile", authenticationMiddleware, myprofileroute);

var authRouter = require('./controllers/authroute');
app.use('/auth', authNotRequired, authRouter);

app.get('/dashboard', authenticationMiddleware, function(req, res) {
    res.render('dashboard', { layout: 'default', title: 'Dashboard Page' });
});

var CommonAPI = require('./modellayer/CommonAPI');
app.use('/commonapi', CommonAPI);

var userregistration = require('./controllers/userregistration');
app.use('/auth', authNotRequired, userregistration);

//Error handling
app.get('*', authNotRequired, function(req, res, next) {
    var err = new Error("Failed to load resource");
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    if (err.status == 404) {
        res.status(404);
        res.render('404error', { layout: 'default', title: '404 Page' });
        return true;
    } else
        next();
});

process.on('uncaughtException', function(err) {
    log.logger.error(err);
});

var port = 2000;
app.listen(port, function() {
    console.log("Test - Server started at port " + port);
});