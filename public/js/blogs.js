$(function() {
    var startindex = 0;
    Handlebars.registerHelper("Compare", function(lvalue, operator, rvalue, options) {

        var operators, result;

        if (arguments.length < 3) {
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
        }

        if (options === undefined) {
            options = rvalue;
            rvalue = operator;
            operator = "===";
        }

        //console.log("l " + lvalue + " , r " + rvalue);

        operators = {
            '==': function(l, r) { return l == r; },
            '===': function(l, r) { return l === r; },
            '!=': function(l, r) { return l != r; },
            '!==': function(l, r) { return l !== r; },
            '<': function(l, r) { return l < r; },
            '>': function(l, r) { return l > r; },
            '<=': function(l, r) { return l <= r; },
            '>=': function(l, r) { return l >= r; },
            'typeof': function(l, r) { return typeof l == r; }
        };

        if (!operators[operator]) {
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
        }

        result = operators[operator](lvalue, rvalue);

        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    if (($('#nextsearchindex').val() != undefined))
        startindex = $('#nextsearchindex').val();

    if (startindex > 0) {
        $("#divImage").removeClass("hidden");
    }

    var icons = {
        header: "ui-icon-circle-arrow-e",
        activeHeader: "ui-icon-circle-arrow-s"
    };

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
        if (($('#nextsearchindex').val() != undefined))
            startindex = $('#nextsearchindex').val();

        var userid = "";
        if ($('#userid').val() != undefined)
            userid = $('#userid').val();

        console.log(startindex + " , " + userid);

        GetBlogsByUserID(startindex, userid, "edit");

        stop_waitMe("blogsbyuserid");
    });

    /* Code to add new blog */
    $("#addeditblogfrm").submit(function(e) {
        e.preventDefault();

        console.log("Before insert : " + $('#nextsearchindex').val());

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

        //console.log(topic + "," + content + " , " + category + " , " + userid + " , " + actiontype);

        if (topic == "" || topic == undefined) {
            isValid = false;
            msgPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add blog topic.")
            );
        }

        if (content == "" || content == undefined) {
            isValid = false;
            msgPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add blog content.")
            );
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
                    //console.log("success : " + JSON.stringify(data));
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

        // console.log(topic + "," + content + " , " + category + " , " + userid + " , " + index + " ," + modifiedby + ", " + createdby + " ," + status + " , " + creationdate);

        if (topic == "" || topic == undefined) {
            isValid = false;
            msgPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add blog topic.")
            );
        }

        if (content == "" || content == undefined) {
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

        console.log(blogcomment + "," + blogid + " , " + username + " , " + userid);

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
            "userid": userid
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
                    //$("#divImage").removeClass("hidden");
                    //$(".profileprogress").imgProgressTo(profileCompleteStatus());

                    // Refresh accordion
                    // if (data != null)
                    //     GetBlogsByUserID(0, userid, "add");

                    hidesuccessmessage("blogcommentvalidationpanel");

                    DisplayComments(blogid, "0");

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
});

let GetBlogsBySIandUserID = (startindex, userid) => {
    //console.log("GetBlogsBySIandUserID : startindex : " + startindex + ", userid : " + userid);
    var d = $.Deferred();

    $.ajax({
            method: "post",
            url: "/blogs/profile",
            data: { "si": startindex, "userid": userid }
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

let GetBlogsByUserID = (startindex, userid, actiontype) => {
    run_waitMe("blogsbyuserid");
    $.when(GetCompiledTemplate("blogsectionbyuserid"), GetBlogsBySIandUserID(startindex, userid))
        .done(function(template, json) {

            var data = { "index": json.index, "category": json.category, "blogs": json.blogs };
            var compiledTemplate = Handlebars.compile(template);
            var newhtml = compiledTemplate(data);

            if (startindex == 0)
                $("#accordion").html(newhtml);
            else
                $("#accordion").append(newhtml);

            $("#accordion").accordion("refresh");

            console.log(JSON.stringify(data));

            if (actiontype == "add") {
                $("#divImage").removeClass("hidden");
                $('#nextsearchindex').val(data.index);
            } else {
                if (json.blogs.count < 4) {
                    $("#divImage").addClass("hidden");
                    $('#nextsearchindex').val("0");
                } else if ($('#nextsearchindex').val() != undefined) {
                    var idx = $('#nextsearchindex').val();
                    //console.log("idx " + idx);
                    if ((parseInt(data.index)) < (parseInt(idx))) {
                        $('#nextsearchindex').val(data.index);
                        $("#divImage").removeClass("hidden");
                    } else {
                        $("#divImage").addClass("hidden");
                        $('#nextsearchindex').val(startindex);
                    }
                }
            }

            console.log("After insert : " + $('#nextsearchindex').val());
        });
    stop_waitMe("blogsbyuserid");
};

// let GetBlogbyBlogID = (blogid) => {
//     run_waitMe("addeditblogfrm");
//     $.when(GetCompiledTemplate("blogsectionbyuserid"), RetrieveBlogByBlogID(blogid))
//         .done(function(template, json) {

//             // console.log("1 " + json.blogs);

//             var data = { "selectedBlogForEdit": json.selectedBlogForEdit, "category": json.category, "blogs": json.blogs };
//             var compiledTemplate = Handlebars.compile(template);
//             var newhtml = compiledTemplate(data);

//             if (data.blogs.count == 1) {
//                 //console.log("2");
//                 $(".addeditblogfrm").html("");
//                 $(".addeditblogfrm").html(newhtml);
//                 $(".addeditblogfrm").removeClass("hidden");
//             }

//             //console.log(JSON.stringify(data.blogs.count));
//         });
//     stop_waitMe("addeditblogfrm");
// };

// let RetrieveBlogByBlogID = (_id) => {
//     //console.log("RetrieveBlogByBlogID : blogid : " + _id);
//     var d = $.Deferred();

//     $.ajax({
//             method: "get",
//             url: "/blogs/edit/" + _id
//         })
//         .done(function(jsonResult) {
//             d.resolve(jsonResult);
//         })
//         .fail(function() {
//             d.reject;
//         })
//         .always(function() {});
//     return d.promise();
// };

let DeleteBlogByID = (_id) => {
    var msgPanel = $("<div></div>");

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
            url: "/blogs/delete/" + _id,
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

let DisplayComments = (blogid, startindex) => {
    run_waitMe("commentpanel");
    $.when(GetCompiledTemplate("viewcomment"), Getcommentsbyblogid(blogid, startindex))
        .done(function(template, json) {

            var data = { "comments": json.comments };
            var compiledTemplate = Handlebars.compile(template);
            var newhtml = compiledTemplate(data);

            if (startindex == 0)
                $("#commentpanel").html(newhtml);
            //else
            //    $("#commentpanel").append(newhtml);

            console.log(JSON.stringify(data));

            // if (actiontype == "add") {
            //     $("#divImage").removeClass("hidden");
            //     $('#nextsearchindex').val(data.index);
            //} else {
            //     if (json.blogs.count < 4) {
            //         $("#divImage").addClass("hidden");
            //         $('#nextsearchindex').val("0");
            //     } else if ($('#nextsearchindex').val() != undefined) {
            //         var idx = $('#nextsearchindex').val();
            //         //console.log("idx " + idx);
            //         if ((parseInt(data.index)) < (parseInt(idx))) {
            //             $('#nextsearchindex').val(data.index);
            //             $("#divImage").removeClass("hidden");
            //         } else {
            //             $("#divImage").addClass("hidden");
            //             $('#nextsearchindex').val(startindex);
            //         }
            //     }
            // }

            //console.log("After insert : " + $('#nextsearchindex').val());
        });
    stop_waitMe("commentpanel");
};

let Getcommentsbyblogid = (blogid, startindex) => {
    //console.log("GetBlogsBySIandUserID : startindex : " + startindex + ", userid : " + userid);
    var d = $.Deferred();

    $.ajax({
            method: "get",
            url: "/viewblog/getcomments/" + blogid + "/" + startindex
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