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
    defaultLayout: 'layouts',
    helpers: {},
    partialsDir: ['views/partials/']
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

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