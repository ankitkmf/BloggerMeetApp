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
var pageList = require("./data/pageList.json");

var isAuthenticated = require('./modellayer/authentication');

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

// app.use(expressSession({
//     secret: '2C44-4D44-WppQ38S',
//     resave: true,
//     saveUninitialized: true
// }));

// // Authentication and Authorization Middleware
// var auth = function(req, res, next) {
//     if (req.session && req.session.user === "amy" && req.session.admin)
//         return next();
//     else
//         return res.sendStatus(401);
// };



// // Logout endpoint
// app.get('/logout', function(req, res) {
//     req.session.destroy();
//     res.send("logout success!");
// });

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// let isAuthenticated = (req, res, next) => {
//     //console.log(req.route.path);
//     console.log(req);
//     console.log(req.query.url);
//     pageList.forEach(function(index, value) {
//         console.log("Index:" + index["key"] + ", value:" + index["value"]);
//     });
//     next();
//     // if (req.isAuthenticated()) {
//     //     res.locals.Info.user = req.user;
//     //     res.locals.Info.IsLogin = "true";

//     //     res.locals.Info = {
//     //         user: req.user,
//     //         IsLogin: "true"
//     //     };
//     //     res.locals.Info.IsLogin = "true";
//     //     console.log("Authenticated");
//     //     next();
//     //     return;
//     // } else {
//     //     console.log("Not Authenticated");
//     //     res.redirect("/");
//     // }
// };

// let isLoginRequired = (req, res, next) => {
//     if (req.isAuthenticated()) {
//         res.locals.user = req.user;
//         next();
//         return;
//     }
// };

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

app.get("/myprofile", function(req, res) {
    res.render("myprofile", { layout: 'default', title: 'myprofile Page' });
});

var authRouter = require('./controllers/authroute');
app.use('/auth', authRouter);

app.use(function(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
        next();
        return;
    }
    res.redirect("/");
    //res.redirect("/auth/login");
});

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