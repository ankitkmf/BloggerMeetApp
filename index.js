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
console.log(app.locals.config);

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'profilephoto')));

var hbs = exphbs.create({
    defaultLayout: 'default',
    helpers: {
        IsAdmin: require("./public/js/helper/isadmin"),
        CheckIsAdmin: require("./public/js/helper/checkisadmin"),
        Compare: require("./public/js/helper/compare"),
        ValidateBlogs: require("./public/js/helper/validateBlogs"),
        CovertISODate: require("./public/js/helper/convertisodate")
            //GetBlogStatus: require("./public/js/helper/getblogstatus")
    },
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

// let authenticationMiddleware = function(req, res, next) {
//     if (req.isAuthenticated()) {
//         res.locals.user = req.user;
//         return next();
//     }
//     res.redirect('/');
// };

let authenticationMiddleware = function(req, res, next) {
    console.log("**************start******************");
    console.log("start req.session.redirectUrl:" + req.session.redirectUrl);
    if (req.session) {
        console.log("***user is visiting :" + req.session.userVisit);
        console.log("req.headers.referer:" + req.headers.referer);
        console.log("req.originalUrl:" + req.originalUrl);
        console.log("req.url:" + req.url);
        req.session.redirectUrl = req.originalUrl || req.url;
    }
    console.log("end req.session.redirectUrl:" + req.session.redirectUrl);
    console.log("**************end******************");
    if (req.isAuthenticated()) {
        console.log("*****user Authenticated");
        res.locals.user = req.user;
        return next();
    }
    req.session.userVisit = req.session.userVisit != null ? ++(req.session.userVisit) : 1;

    res.redirect('/');
};

let authNotRequired = (req, res, next) => {
    // req.session.returnTo = req.path;
    //console.log("req.path1:" + req.path);
    console.log("---------------start---------------------");
    console.log("start 1req.session.redirectUrl:" + req.session.redirectUrl);
    if (req.isAuthenticated()) {
        console.log("-----user Authenticated");
        res.locals.user = req.user;
        req.session.userVisit += 1;
    } else {
        req.session.userVisit = req.session.userVisit != null ? ++(req.session.userVisit) : 1;
    }
    if (req.session) {
        console.log("1---user is visiting :" + req.session.userVisit);
        console.log("1req.headers.referer:" + req.headers.referer);
        console.log("1req.originalUrl:" + req.originalUrl);
        console.log("1req.url:" + req.url);
        // req.session.redirectUrl = req.originalUrl || req.url;
        console.log("end 1req.session.redirectUrl:" + req.session.redirectUrl);
        console.log("----------------end--------------------");
    }


    next();
};

app.get('/', authNotRequired, function(req, res) {
    var blogs = {};
    var blog = require("./modellayer/blogs");
    var categoryList = blog.category;

    blog.blogs("0", "all").then(function(response) {
        blogs = response.data;

        log.logger.info("Home Page : retrieve blogs : blogs count " + blogs.count);

        var lastblogid = "0";
        _.forEach(blogs.result, function(result) {
            lastblogid = result._id
        });

        res.render('home', {
            layout: 'default',
            title: 'Home Page',
            blogs: blogs,
            category: categoryList,
            lastblogid: lastblogid
        });
    }).catch(function(err) {
        log.logger.error("Home Page : failed to retrieve blogs : error " + err);
        blogs = { "result": [], "count": 0 };
        res.render('home', {
            layout: 'default',
            title: 'Home Page',
            blogs: blogs,
            category: categoryList,
            lastblogid: "0"
        });
    });
});

var myprofileroute = require('./modellayer/myprofile');
app.use("/myprofile", authenticationMiddleware, myprofileroute);

var blogroute = require('./controllers/blog');
app.use("/blogs", authenticationMiddleware, blogroute);

var viewblogroute = require('./controllers/viewblog');
app.use("/viewblog", authNotRequired, viewblogroute);

var authRouter = require('./controllers/authroute');
app.use('/auth', authNotRequired, authRouter);

// app.get('/dashboard', authenticationMiddleware, function(req, res) {
//     res.render('dashboard', { layout: 'default', title: 'Dashboard Page' });
// });

var CommonAPI = require('./modellayer/commonAPI');
app.use('/commonapi', CommonAPI);

var userregistration = require('./controllers/userregistration');
app.use('/auth', authNotRequired, userregistration);

var forgotPwd = require('./controllers/forgotPwd');
app.use('/auth', authNotRequired, forgotPwd);

var changepwdCtrl = require('./controllers/changepwdCtrl');
app.use('/auth', authNotRequired, changepwdCtrl);

var dashboardCtrl = require('./controllers/dashboardCtrl');
app.use('/auth', authenticationMiddleware, dashboardCtrl);

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
    console.log("uncaughtException:" + err);
    log.logger.error(err);
});

var port = 2000;
app.listen(port, function() {
    console.log("Test - Server started at port " + port);
});