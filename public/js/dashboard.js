'use strict';
$(function() {
    var servicePath = $("#spnServicePath").text();
    GetUserGraph(servicePath);
    $(".regUserGraph").on("click", () => {
        run_waitMe("divRegUserGraph");
        GetUserGraph(servicePath);
    });
});

let GetUserGraph = (path) => {
    $.ajax({
            method: "Get",
            url: "/commonAPI/data/usergraph"
        })
        .done(function(data) {
            if (data != null) {
                // console.log("step 2:" + JSON.stringify(data));
                var result = CreateGraphCollection(data);
                console.log("step 2:" + JSON.stringify(result));
                userGraphContainer(result);
            }
        })
        .fail(function(err) {})
        .always(function() {
            console.log("step 6");
            stop_waitMe("divRegUserGraph");
        });
};

let userGraphContainer = results => {
    // var collection = [];
    // collection.push(results);
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