'use strict';
$(function() {
    var userID = "",
        type = "all";
    if ($("#userSelectedID").val() != null && $("#userSelectedID").val() != "") {
        userID = $("#userSelectedID").val();
        type = "user";
    }
    GetUserSerach();
    GetUserGraph();
    GetUserBlogs(type, userID);
    GetUserComments(type, userID);
    GetUserInfo(type, userID);
    GetUserLoginHistory(type, userID);

    $("#UserSearchBtn").on("click", () => {
        GetUserLoginHistory("user", $("#userSelectedID").val());
        GetUserBlogs("user", $("#userSelectedID").val());
        GetUserComments("user", $("#userSelectedID").val());
        GetUserInfo("user", $("#userSelectedID").val());
    });

    $(".regUserLoginGraph").on("click", () => {
        GetUserLoginHistory("all", "");
    });

    $(".regUserGraph").on("click", () => {
        GetUserGraph();
    });

    $(".divUserBlogs").on("click", "li>span.regUserBlogs", () => {
        GetUserBlogs("all", "");
    });

    $(".divUserComments").on("click", "li>span.regUserComments", () => {
        GetUserComments("all", "");
    });

    $(".divUserInfo").on("click", "li>span.regUserInfo", () => {
        GetUserInfo("all", "");;
    });

    $("#divUserInfo").on("click", "li.hover", function() {
        var type = $(this).data("type");
        if (type != null)
            GetUserTableData(type);
        else
            console.log("type is not define:");
        // GetUserInfo();
    });

    $(".divUserBlogs").on("click", "li.hover", function() {
        var type = $(this).data("type");
        console.log(type);
        if (type != null)
            GetBlogTableData(type);
        else
            console.log("type is not define:");
        // GetUserInfo();
    });

    $(".divUserTable").on("click", "td>button", function() {
        console.log("click1");
        var item = {};
        var jsonObj = [];
        item["id"] = $(this).closest("tr").data("id");
        var userName = $(this).closest("tr").data("name");
        $(this).closest("tr").find('input:checkbox').each(function() {
            if ($(this).data('type') === "email") {
                item["email"] = $(this).is(':checked');
            } else if ($(this).data('type') === "admin") {
                item["admin"] = $(this).is(':checked');
            } else if ($(this).data('type') === "active") {
                item["active"] = $(this).is(':checked');
            }
        });
        jsonObj.push(item);
        UpdateTableRecords(jsonObj, userName);
    });

    $(".divUserTable").on("click", "div>button", function() {
        console.log("Click :" + $(this).closest(".blogtable").data("name"));
        console.log($(this).parent("div").find($("input[type='radio']:checked")).data("type"));
        console.log("click");
        var data = {
            id: $(this).closest(".blogtable").data("name"),
            type: $(this).parent("div").find($("input[type='radio']:checked")).data("type")
        };
        if (data.id != null && data.type != null) {
            swal({
                title: "Are you sure?",
                text: "Are you sure that you want to update this records?",
                type: "warning",
                showCancelButton: true,
                closeOnConfirm: false,
                confirmButtonText: "Yes, update it!",
                confirmButtonColor: "#ec6c62"
            }, function() {
                $.ajax({
                        method: "Post",
                        url: "/commonAPI/data/updateBlogTableRecords",
                        data: data
                    })
                    .done(function(result) {
                        GetUserBlogs("all", "");
                        swal("Updated! Blog is successfully updated!", "success");
                    })
                    .error(function(data) {
                        swal("Oops", "We couldn't connect to the server!", "error");
                    });
            });
        }
    });
});

let GetUserLoginHistory = (type, id) => {
    console.log("userSelectedID id:" + id);
    id = (id != null && id != "") ? id : "test";
    var path = "/commonAPI/data/GetUserHistory/" + type + "/" + id;
    console.log("Path:" + path);
    run_waitMe("divUserLoginHistoryGraph");
    if (type != null) {
        $.ajax({
                method: "Get",
                url: "/commonAPI/data/GetUserHistory/" + type + "/" + id
            })
            .done(function(data) {
                if (data != null) {
                    var result = CreateGraphCollection(data);
                    userGraphContainer(result, "loginGraphContainer");
                }
            })
            .fail(function(err) {})
            .always(function() {
                stop_waitMe("divUserLoginHistoryGraph");
            });
    }
};

let GetUserSerach = () => {
    $.ajax({
            method: "Get",
            url: "/commonAPI/data/GetUserSerach"
        })
        .done(function(data) {
            if (data != null) {
                var users = [];
                $.each(data, function(key, value) {
                    var list = {};
                    list.label = value.name;
                    list.authType = value.authType;
                    list.value = value._id;
                    list.userImage = (value.userImage == "" || value.userImage == null) ?
                        "/images/default.png" : userImagePath(value.userImage);
                    users.push(list);
                });
                userAutoSuggest(users);
            }
        })
        .fail(function(err) {})
        .always(function() {
            stop_waitMe("divRegUserGraph");
        });
};

let userImagePath = (path) => {
    var image = path.split("?");
    return image[0]; //+ "?sz=18";
};

let userAutoSuggest = (data) => {
    // console.log("Users:" + JSON.stringify(data));
    $("#inputSearch").autocomplete({
            minLength: 1,
            source: data,
            focus: function(event, ui) {
                $("#inputSearch").val(ui.item.label);
                return false;
            },
            // close: function(event, ui) {
            //     if (!$("ul.ui-autocomplete").is(":visible")) {
            //         $("ul.ui-autocomplete").show();
            //     }
            // },
            select: function(event, ui) {
                var value = ui.item.label + " ( " + ui.item.authType + " ) ";
                $("#inputSearch").val(value);
                $("#userSelectedID").val(ui.item.value);
                return false;
            }
        })
        .autocomplete("instance")._renderItem = function(ul, item) {
            return $("<li>")
                .append("<div class='list-group list-group-item'>" +
                    "<img class='resize' src=" + item.userImage + ">  " +
                    item.label +
                    "<span class='badge'>" + item.authType + "</span></div>")
                .appendTo(ul);
        };
};

let GetUserGraph = () => {
    run_waitMe("divRegUserGraph");
    $.ajax({
            method: "Get",
            url: "/commonAPI/data/usergraph"
        })
        .done(function(data) {
            if (data != null) {
                var result = CreateGraphCollection(data);
                userGraphContainer(result, "graphContainer");
            }
        })
        .fail(function(err) {})
        .always(function() {
            stop_waitMe("divRegUserGraph");
        });
};

let GetUserBlogs = (type, id) => {
    id = (id != null && id != "") ? id : "test";
    var path = "/commonAPI/data/userBlogs/" + type + "/" + id;
    // var path = "/commonAPI/data/userBlogs";
    fillDashboardBlock("dashboardBlogsInfo", path, "divUserBlogs", "divUserBlogs");
};

let GetUserComments = (type, id) => {
    id = (id != null && id != "") ? id : "test";
    var path = "/commonAPI/data/userComments/" + type + "/" + id;
    //  var path = "/commonAPI/data/userComments";
    fillDashboardBlock("dashboardComments", path, "divUserComments", "divUserComments");
};

let GetUserInfo = (type, id) => {
    //var path = "/commonAPI/data/userInfo";
    id = (id != null && id != "") ? id : "test";
    var path = "/commonAPI/data/userInfo/" + type + "/" + id;
    fillDashboardBlock("dashboardUserInfo", path, "divUserInfo", "divUserInfo");
};

let UpdateTableRecords = (record, userName) => {
    // console.log("record:" + JSON.stringify(record));
    swal({
        title: "Are you sure?",
        text: "Are you sure that you want to update this records?",
        type: "warning",
        showCancelButton: true,
        closeOnConfirm: false,
        confirmButtonText: "Yes, update it!",
        confirmButtonColor: "#ec6c62"
    }, function() {
        $.ajax({
                method: "Post",
                url: "/commonAPI/data/updateTableRecords",
                data: record[0]
            })
            .done(function(data) {
                userName = userName != null ? userName : "Your record";
                // GetUserInfo();
                var userID = "",
                    type = "all";
                // GetUserBlogs(type, userID);
                GetUserInfo("all", "");;
                (type, userID);
                swal("Updated!", userName + " is successfully updated!", "success");
            })
            .error(function(data) {
                swal("Oops", "We couldn't connect to the server!", "error");
            });
    });
}

let GetUserTableData = type => {
    if (type != null) {
        run_waitMe("divUserTable");
        var path = "/commonAPI/data/userDatatable/" + type;
        $.when(GetCompiledTemplate("dashboardTable"), GetDashboardBlockJSON(path))
            .done(function(template, json) {
                var data = { "user": json };
                var compiledTemplate = Handlebars.compile(template);
                var html = compiledTemplate(data);
                $(".divUserInnerTable").html('');
                // $(".divUserInnerTable").html(html).show();
                //console.log("GetUserTableData:" + JSON.stringify(data));
                var html = compiledTemplate(data);
                $(".divUserInnerTable").html(html).show();
                $('.tbUserTable').DataTable({
                    "order": [
                        [3, "desc"]
                    ],
                    "aLengthMenu": [
                        [5, 10, 20],
                        [5, 10, 20]
                    ]
                });
            }).fail(function(err) {
                console.log("Err:" + JSON.stringify(err));
            }).always(function() {
                stop_waitMe("divUserTable");
            });;
    } else
        console.log("type is null");
}

let GetBlogTableData = type => {
    if (type != null) {
        run_waitMe("divUserBlogs");
        var path = "/commonAPI/data/userBlogDatatable/" + type;
        $.when(GetCompiledTemplate("dashboardBlogTableData"), GetDashboardBlockJSON(path))
            .done(function(template, json) {
                var data = { "user": json };
                //  console.log("GetBlogTableData:" + JSON.stringify(data));
                var compiledTemplate = Handlebars.compile(template);
                var html = compiledTemplate(data);
                $(".divUserInnerTable").html('');
                $(".divUserInnerTable").html(html).show();

                // var icons = {
                //     header: "ui-icon-circle-arrow-e",
                //     activeHeader: "ui-icon-circle-arrow-s"
                // };

                $('#accordion').accordion({
                    heightStyle: 'content',
                    collapsible: true,
                    // icons: icons,
                    header: "> div > h3",
                    event: "mouseup"
                }).sortable({
                    axis: "y",
                    handle: "h3",
                    stop: function(event, ui) {
                        ui.item.children("h3").triggerHandler("focusout");
                        $(this).accordion("refresh");
                    }
                });
            }).fail(function(err) {
                console.log("Err:" + JSON.stringify(err));
            }).always(function() {
                stop_waitMe("divUserBlogs");
            });
    } else
        console.log("type is null");
}

let userGraphContainer = (results, divID) => {
    if ($("#" + divID).length) {
        Highcharts.chart(divID, {
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