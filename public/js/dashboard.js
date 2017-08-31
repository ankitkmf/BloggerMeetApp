'use strict';
$(function() {
    GetUserGraph();
    GetUserBlogs();
    GetUserComments();
    $(".regUserGraph").on("click", () => {
        GetUserGraph();
    });

    $(".divUserBlogs").on("click", "li>span.regUserBlogs", () => {
        GetUserBlogs();
    });

    $(".divUserComments").on("click", "li>span.regUserComments", () => {
        GetUserComments();
    });
});

let GetUserGraph = () => {
    run_waitMe("divRegUserGraph");
    $.ajax({
            method: "Get",
            url: "/commonAPI/data/usergraph"
        })
        .done(function(data) {
            if (data != null) {
                var result = CreateGraphCollection(data);
                userGraphContainer(result);
            }
        })
        .fail(function(err) {})
        .always(function() {
            stop_waitMe("divRegUserGraph");
        });
};

let GetUserBlogs = () => {
    var path = "/commonAPI/data/userBlogs";
    fillDashboardBlock("dashboardBlogsInfo", path, "divUserBlogs", "divUserBlogs");
};

let GetUserComments = () => {
    var path = "/commonAPI/data/userComments";
    fillDashboardBlock("dashboardComments", path, "divUserComments", "divUserComments");
};

let userGraphContainer = results => {
    if ($('#graphContainer').length) {
        Highcharts.chart("graphContainer", {
            title: {
                text: "2016-2017"
            },
            yAxis: {
                title: {
                    text: "Number of Users"
                }
            },
            xAxis: {
                type: "datetime",
                dateTimeLabelFormats: {
                    day: "%e. %b",
                    month: "%b '%y",
                    year: "%Y"
                }
            },
            legend: {
                // layout: 'vertical',
                // align: 'right',
                // verticalAlign: 'middle'
                backgroundColor: "#FCFFC5"
            },
            plotOptions: {
                series: {
                    pointStart: 0
                }
            },
            series: results
        });
    }
};

let CreateGraphCollection = results => {
    var collection = [];
    var collectionList = [];
    var fullCollectionList = {};
    var collectionName = "";

    if (results != null) {
        $.each(results, function(i, result) {

            collection = [];
            $.each(result, function(i, data) {

                collectionName = data["text"];
                var d = new Date(data["dateTime"]);
                var utcDate = Date.UTC(
                    d.getUTCFullYear(),
                    d.getUTCMonth(),
                    d.getUTCDate()
                );

                var data = [utcDate, data["total"]];
                collection.push(data);
            });
            collectionList.push({ name: collectionName, data: collection });
        });
        return collectionList;
    }
};

/* 
    comments:
    tName: template name
    path : service path
    dNmae: content div ID
    wDiv : wait me div 
*/
let fillDashboardBlock = (tName, path, dName, wDiv) => {
    run_waitMe(wDiv);
    $.when(GetCompiledTemplate(tName), GetDashboardBlockJSON(path))
        .done(function(template, json) {
            if (json != null) {
                var data = { "user": json };
                var compiledTemplate = Handlebars.compile(template);
                var html = compiledTemplate(data);
                $("." + dName).html(html).show();
            } else
                console.log("fillDashboardBlock: json null for " + path);
        }).fail(function(err) {
            console.log("fillDashboardBlock:" + path + " ,Err:" + JSON.stringify(err));
        })
        .always(function() {
            stop_waitMe(wDiv);
        });
};

let GetDashboardBlockJSON = (path) => {
    var d = $.Deferred();
    $.ajax({
            method: "Get",
            url: path
        })
        .done(function(jsonResult) {
            d.resolve(jsonResult);
        })
        .fail(function() {
            d.reject;
        })
        .always(function() {});
    return d.promise();
};