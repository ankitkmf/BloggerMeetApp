'use strict';
$(function() {
    var servicePath = $("#spnServicePath").text();

    $(".regUserGraph").on("click", () => {
        run_waitMe("divRegUserGraph");
        CreateUserGraph(servicePath);
    });
});

let CreateUserGraph = (path) => {
    $.ajax({
            method: "Post",
            url: "/commonAPI/data/usergraph"
        })
        .done(function(jsonResult) {
            console.log("step 2");
            // if (jsonResult) {
            //     $("#forgotPassword").addClass("hidden");
            //     $("#inputEmail").val("");
            //     $(".successPanel").html("<strong>Email has been send! Kindly check & click on link for updating password.</strong> <a href='/' class='alert-link'>Go to home page</a>");
            //     showSuccessPanal();
            // } else {
            //     $("#inputEmail").focus().parent().addClass("has-error");
            //     $(".ErrorPanel").html("Email not found.");
            //     showErrorPanal();
            // }
        })
        .fail(function(err) {})
        .always(function() {
            console.log("step 6");
            stop_waitMe("divRegUserGraph");
        });
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

let userGraphContainer = results => {
    var collection = [];
    collection.push(results);
    if ($('#container').length) {
        Highcharts.chart("container", {
            title: {
                text: "Users growth by day, 2016-2017"
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