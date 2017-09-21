$(function() {
    //var startindex = 0;
    var lastcommentid = "0";
    var lastblogid = "0";

    var commentid = $('#divCommentImage').data("lastcommentid");
    if (commentid == "0") $('#divCommentImage').addClass("hidden");

    var blogid = $('#divImage').data("lastblogid");
    if (blogid == "0") $('#divImage').addClass("hidden");

    var icons = {
        header: "ui-icon-circle-arrow-e",
        activeHeader: "ui-icon-circle-arrow-s"
    };

    $("#topic").on("blur", () => {
        $(".blogsuccesserrorpanel").html("");
        validateTopic();
    });

    $('#accordion').accordion({
        heightStyle: 'content',
        collapsible: true,
        icons: icons,
        header: "> div > h3"
    }).sortable({
        axis: "y",
        handle: "h3",
        stop: function(event, ui) {
            // IE doesn't register the blur when sorting
            // so trigger focusout handlers to remove .ui-state-focus
            ui.item.children("h3").triggerHandler("focusout");

            // Refresh accordion to handle new order
            $(this).accordion("refresh");
        }
    });

    $('.edit').click(function() {
        var id = $(this).data("key");
        //console.log(id);

        $('.showblogdetails_' + id).addClass("hidden");
        $('.blogeditform_' + id).removeClass("hidden");
    });

    $('.remove').on("click", function() {
        var id = $(this).data("key");
        //console.log("id " + id);

        DeleteBlogByID(id);
    });

    $(".canceladdeditblog").click("on", function() {
        $('.addeditblogfrm').addClass("hidden");
        $('.canceladdeditblog').addClass("hidden");
        $('.addblog').removeClass("hidden");
    });

    $(".canceleditblog").on("click", function() {
        var id = $(this).data("key");

        $('.showblogdetails_' + id).removeClass("hidden");
        $('.blogeditform_' + id).addClass("hidden");
    });

    $(".canceladdblog").on("click", function() {
        $('.addeditblogfrm').addClass("hidden");
        $('.addblog').removeClass("hidden");
    });

    $('#divImage').on("click", function() {
        run_waitMe("blogsbyuserid");

        lastblogid = $(this).data("lastblogid");

        var userid = "";
        if ($('#userid').val() != undefined)
            userid = $('#userid').val();

        console.log(lastblogid + " , " + userid);

        GetBlogsByUserID(lastblogid, userid, "edit");

        stop_waitMe("blogsbyuserid");
    });

    $('#divCommentImage').on("click", function() {
        run_waitMe("commentpanel");

        var blogid = $(this).data("blogid");
        lastcommentid = $(this).data("lastcommentid");

        console.log(blogid + " , " + lastcommentid);

        LoadComments(blogid, lastcommentid);

        stop_waitMe("commentpanel");
    });

    /* Code to add new blog */
    $("#addeditblogfrm").submit(function(e) {
        e.preventDefault();

        var isValid = true;
        var msgPanel = $("<div></div>");
        var message = null;

        var modifiedby = $("#modifiedby").val();
        var createdby = $("#createdby").val();
        var _id = $("#_id").val();
        var status = $("#status").val();
        var index = $("#index").val();
        var userid = $("#userid").val();
        var actiontype = $("#actiontype").val();
        var topic = $("#topic").val();
        var content = CKEDITOR.instances['content'].getData();
        var category = $("#category").val();

        if (topic.trim() == "" || topic == undefined) {
            isValid = false;
            $("#topic").val("");
            msgPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add blog topic.")
            );
            $("#topic").focus();
        } else if (!alphanumericinputvalidation("topic")) {
            isValid = false;
            msgPanel.append(
                ErrorMessage("<strong>Warning!</strong> Blog name can have alphabate and number only.")
            );
            $("#topic").focus();
        }

        if (content.trim() == "" || content == undefined) {
            isValid = false;
            msgPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add blog content.")
            );
            $("#content").focus();
        }

        var data = {};
        data = {
            "topic": topic,
            "content": content,
            "category": category,
            "userid": userid,
            "createdby": createdby
        }

        if (isValid) {
            run_waitMe("addeditblogfrm");
            $(".blogsuccesserrorpanel").html("");

            $.ajax({
                url: "/blogs/savedata/add",
                data: data,
                method: "POST",
                success: function(data) {
                    msgPanel.append(
                        SuccessMessage("<strong>Thank You!</strong> New Blog is added.")
                    );
                    $(".blogsuccesserrorpanel").html(msgPanel).removeClass("hidden");
                    $("#divImage").removeClass("hidden");
                    //$(".profileprogress").imgProgressTo(profileCompleteStatus());

                    // Refresh accordion
                    if (data != null)
                        GetBlogsByUserID(0, userid, "add");

                    hidesuccessmessage("blogsuccesserrorpanel");

                    stop_waitMe("addeditblogfrm");
                },
                error: function(error) {
                    console.log("error : " + error);
                    msgPanel.append(
                        ErrorMessage("<strong>Warning!</strong> error.")
                    );
                    $(".blogsuccesserrorpanel").html(msgPanel).removeClass("hidden");
                    stop_waitMe("addeditblogfrm");
                }
            });
        } else {
            $(".blogsuccesserrorpanel").html(msgPanel).removeClass("hidden");
        }
    });

    /* Code to update a blog */
    $("#accordion").on("click", ".saveblog", function(e) {
        e.preventDefault();

        var isValid = true;
        var msgPanel = $("<div></div>");
        var message = null;

        var _id = $(this).data("key");
        var modifiedby = $("#username").val();
        var createdby = $("#createdby_" + _id).val();
        var status = $("#status_" + _id).val();
        var index = $("#index_" + _id).val();
        var userid = $("#userid").val();
        var actiontype = $("#actiontype_" + _id).val();
        var topic = $("#topic_" + _id).val();
        var content = CKEDITOR.instances['content_' + _id].getData();
        var category = $("#category_" + _id).val();
        var creationdate = $("#creationdate_" + _id).val();

        if (topic.trim() == "" || topic == undefined) {
            isValid = false;
            msgPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add blog topic.")
            );
            $("#topic_" + _id).focus();
        } else if (!alphanumericinputvalidation("topic_" + _id)) {
            isValid = false;
            msgPanel.append(
                ErrorMessage("<strong>Warning!</strong> Blog name can have alphabate and number only.")
            );
            $("#topic_" + _id).focus();
        }

        if (content.trim() == "" || content == undefined) {
            isValid = false;
            msgPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add blog content.")
            );
        }

        var datacollection = {};
        datacollection = {
            "_id": _id,
            "topic": topic,
            "content": content,
            "category": category,
            "modifiedby": modifiedby,
            "index": index,
            "status": status,
            "userid": userid
        }

        console.log("datacollection " + JSON.stringify(datacollection));

        if (isValid) {
            $(".blogeditvalidationpanel").html("");

            swal({
                title: "Are you sure?",
                text: "Are you sure that you want to update this blog?",
                type: "warning",
                showCancelButton: true,
                closeOnConfirm: false,
                confirmButtonText: "Yes, update it!",
                confirmButtonColor: "#ec6c62"
            }, function() {

                console.log("data : " + JSON.stringify(datacollection));

                $.ajax({
                    url: "/blogs/savedata/edit",
                    data: datacollection,
                    method: "POST",
                    success: function(data) {
                        $('.showblogdetails_' + _id).removeClass("hidden");
                        $('.blogeditform_' + _id).addClass("hidden");

                        $('.showblogdetails_' + _id).html("");
                        $('.showblogdetails_' + _id).html("<span class = 'blogpostdate glyphicon glyphicon-time' ></span> Posted on " +
                            creationdate + " " + content);

                        $('.blogheader_' + _id).html("");
                        $('.blogheader_' + _id).html(topic);

                        swal("Updated!Blog ID : ", _id + " is successfully updated!", "success");
                    },
                    error: function(error) {
                        console.log("error : " + error);
                        swal("Oops", "We couldn't connect to the server!", "error");
                    }
                });
            });

        } else {
            $(".blogeditvalidationpanel").html(msgPanel).removeClass("hidden");
        }
    });

    /* Code to add blog comment */
    $(".blogcommentsection").on("click", ".addblogcomment", function(e) {
        e.preventDefault();

        var isValid = true;
        var msgPanel = $("<div></div>");
        var message = null;

        var blogcomment = $("#blogcomment").val();
        var blogid = $("#blogid").val();
        var username = $("#username").val();
        var userid = $("#userid").val();
        var blogtopic = $("#blogtopic").val();

        console.log(blogcomment + "," + blogid + " , " + username + " , " + userid + " , " + blogtopic);

        if (blogcomment == "" || blogcomment == undefined) {
            isValid = false;
            msgPanel.append(
                ErrorMessage("<strong>Warning!</strong> Comment cannot be empty.")
            );
        }

        var datacollection = {};
        datacollection = {
            "blogcomment": blogcomment,
            "blogid": blogid,
            "username": username,
            "userid": userid,
            "blogtopic": blogtopic
        }

        if (isValid) {
            run_waitMe("blogcommentsection");
            $(".blogcommentvalidationpanel").html("");

            $.ajax({
                url: "/viewblog/addcomment",
                data: datacollection,
                method: "POST",
                success: function(data) {
                    //console.log("success : " + JSON.stringify(data));
                    msgPanel.append(
                        SuccessMessage("<strong>Thank You!</strong> New comment is added.")
                    );
                    $(".blogcommentvalidationpanel").html(msgPanel).removeClass("hidden");
                    //$(".profileprogress").imgProgressTo(profileCompleteStatus());

                    hidesuccessmessage("blogcommentvalidationpanel");

                    LoadComments(blogid, lastcommentid);

                    stop_waitMe("blogcommentsection");
                },
                error: function(error) {
                    console.log("error : " + error);
                    msgPanel.append(
                        ErrorMessage("<strong>Warning!</strong> error.")
                    );
                    $(".blogcommentvalidationpanel").html(msgPanel).removeClass("hidden");
                    stop_waitMe("blogcommentsection");
                }
            });
        } else {
            $(".blogcommentvalidationpanel").html(msgPanel).removeClass("hidden");
        }
    });

    $("#showallcomments").on("click", function() {

        var selectedBlogIDCmnt = $(this).data("blogid");
        console.log(selectedBlogIDCmnt);

        if (selectedBlogIDCmnt != "") {
            LoadCommentHistory(selectedBlogIDCmnt);
        } else {
            $(".allcommentdiv").html("");
        }
    });

    $(".allcommentdiv").on("click", "span>button", function() {
        console.log("click");
        console.log("Click :" + $(this).closest(".commenttable").data("id"));
        console.log($(this).parent("span").find($("input[type='radio']:checked")).data("type"));
        console.log("click");
        var data = {
            _id: $(this).closest(".commenttable").data("id"),
            status: $(this).parent("span").find($("input[type='radio']:checked")).data("type")
        };
        if (data._id != null && data.status != null) {
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
                        url: "/myprofile/updatecomment",
                        data: data
                    })
                    .done(function(result) {
                        // var selectedBlogIDCmnt = "";
                        // if ($('#selectedBlogIDCmnt').val() != undefined)
                        //     selectedBlogIDCmnt = $('#selectedBlogIDCmnt').val();

                        swal("Updated! Comment is successfully updated!", "Success");
                    })
                    .error(function(data) {
                        swal("Oops", "We couldn't connect to the server!", "Error");
                    });
            });
        }
    });
});

let validateTopic = () => {
    var topic = $("#topic").val();
    var msgPanel = $("<div></div>");

    if (topic.trim() == "" || topic == undefined) {
        $("#topic").val("");
        msgPanel.append(
            ErrorMessage("<strong>Warning!</strong> Please add blog topic.")
        );
        $("#topic").focus();
    } else if (!alphanumericinputvalidation("topic")) {
        msgPanel.append(
            ErrorMessage("<strong>Warning!</strong> Blog name can have alphabate and number only.")
        );
        $("#topic").focus();
    }
    $(".blogsuccesserrorpanel").html(msgPanel).removeClass("hidden");
}

let GetBlogsBySIandUserID = (lastblogid, userid) => {
    var d = $.Deferred();

    $.ajax({
            method: "post",
            url: "/blogs/profile",
            data: { "lastblogid": lastblogid, "userid": userid }
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

let GetBlogsByUserID = (lastblogid, userid, actiontype) => {
    run_waitMe("blogsbyuserid");
    $.when(GetCompiledTemplate("blogsectionbyuserid"), GetBlogsBySIandUserID(lastblogid, userid))
        .done(function(template, json) {

            var data = { "lastblogid": json.lastblogid, "category": json.category, "blogs": json.blogs };
            var compiledTemplate = Handlebars.compile(template);
            var newhtml = compiledTemplate(data);

            if (lastblogid == 0)
                $("#accordion").html(newhtml);
            else
                $("#accordion").append(newhtml);

            $("#accordion").accordion("refresh");

            console.log(JSON.stringify(data));

            lastblogid = json.lastblogid;

            $("#divImage").removeData("lastblogid");
            $("#divImage").data("lastblogid", lastblogid);

            if (actiontype == "add") {
                $("#divImage").removeClass("hidden");
            } else {
                if (json.blogs.count < 4) {
                    $("#divImage").addClass("hidden");
                } else {
                    $("#divImage").removeClass("hidden");
                }
            }
        });
    stop_waitMe("blogsbyuserid");
}

let DeleteBlogByID = (_id) => {
    var msgPanel = $("<div></div>");
    var userid = $("#userid").val();

    swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this blog?",
        type: "warning",
        showCancelButton: true,
        closeOnConfirm: false,
        confirmButtonText: "Yes, delete it!",
        confirmButtonColor: "#ec6c62"
    }, function() {
        $.ajax({
            url: "/blogs/delete/" + _id + "/" + userid,
            method: "get",
            success: function(data) {
                $(".blog_" + _id).html("");
                swal("Updated!", _id + " is successfully deleted!", "success");
            },
            error: function(error) {
                console.log("error : " + error);
                swal("Oops", "We couldn't connect to the server!", "error");
            }
        });
    });
};

let LoadComments = (blogid, lastcommentid) => {
    run_waitMe("commentpanel");
    $.when(GetCompiledTemplate("viewcomment"), Getcommentsbyblogid(blogid, lastcommentid))
        .done(function(template, json) {

            var data = { "comments": json };
            var compiledTemplate = Handlebars.compile(template);
            var newhtml = compiledTemplate(data);

            if (lastcommentid == "0")
                $(".commentpanel").html(newhtml);
            else
                $(".commentpanel").append(newhtml);

            lastcommentid = json.lastCommentId;

            if (json.count < 4)
                $("#divCommentImage").addClass("hidden");
            else
                $("#divCommentImage").removeClass("hidden");

            $("#divCommentImage").removeData("lastcommentid");
            $("#divCommentImage").data("lastcommentid", lastcommentid);
        });
    stop_waitMe("commentpanel");
};

let Getcommentsbyblogid = (blogid, lastcommentid) => {
    //console.log("GetBlogsBySIandUserID : startindex : " + startindex + ", userid : " + userid);
    var d = $.Deferred();

    $.ajax({
            method: "get",
            url: "/viewblog/getcomments/" + blogid + "/" + lastcommentid
                //data: { "si": startindex, "userid": userid }
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

function hidesuccessmessage(divID) {
    setTimeout(function() {
        $('.' + divID).html("");
    }, 5000);
}

let LoadCommentHistory = (selectedBlogID) => {
    run_waitMe("allcommentdiv");
    $.when(GetCompiledTemplate("commenthistory"), GetCommentsByBlogID(selectedBlogID))
        .done(function(template, json) {

            var data = { "commenthistory": json, "selectedBlogID": selectedBlogID };
            var compiledTemplate = Handlebars.compile(template);
            var newhtml = compiledTemplate(data);
            $(".allcommentdiv").html("");
            $(".allcommentdiv").html(newhtml);
        });
    stop_waitMe("allcommentdiv");
};

let GetCommentsByBlogID = (selectedBlogID) => {
    //console.log("GetBlogsBySIandUserID : startindex : " + startindex + ", userid : " + userid);
    var d = $.Deferred();

    $.ajax({
            method: "get",
            url: "/viewblog/GetCommentByBlogID/" + selectedBlogID
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