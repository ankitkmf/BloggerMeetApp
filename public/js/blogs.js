$(function() {
    //$("#accordion").accordion();

    // $("#accordion").accordion({
    //     activate: function(event, ui) {
    //         alert("after activate : " + ui.newHeader.text()); // For instance.
    //     }
    // });

    // $("#accordion").accordion({
    //     beforeActivate: function(event, ui) {
    //         alert("beforeActivate " + ui.newHeader.text());
    //     }
    // });

    var startindex = 0;
    if (($('#nextsearindex').val() != undefined))
        startindex = $('#nextsearindex').val();

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
        //e.preventDefault();
        //var _id = $($(this).parents('div')[0]).find('input[id="_id"]').val();
        //var userid = $($(this).parents('div')[0]).find('input[id="userid"]').val();
        //var topic = $($(this).parents('div')[0]).find('input[id="topic"]').val();
        //var content = $($(this).parents('div')[0]).find('input[id="content"]').val();
        //var categorykey = $($(this).parents('div')[0]).find('input[id="categorykey"]').val();

        var id = $(this).data("key");
        console.log(id);

        // $(".addeditblogfrm").removeClass("hidden");
        // $(".blogsuccesserrorpanel").html("");


        $('.showblogdetails_' + id).addClass("hidden");
        $('.blogeditform_' + id).removeClass("hidden");

        //GetBlogbyBlogID(_id);

        //GetBlogsByUserID(0, userid);
        //e.stopPropagation();
    });

    $('.remove').on("click", function() {
        //alert('glyphicon glyphicon-remove');
        //e.preventDefault();
        //e.stopPropagation();

        var id = $(this).data("key");
        console.log("id " + id);

        DeleteBlogByID(id);
    });

    $(".addblog").click("on", function() {
        //AddBlog();
        $('.addeditblogfrm').removeClass("hidden");
        $('.canceladdeditblog').removeClass("hidden");
        $('.addblog').addClass("hidden");
        $('.blogeditsuccesserrorpanel').html("");
        $('.blogeditsuccesserrorpanel').addClass("hidden");
        //$("#divImage").removeClass("hidden");
        //$('.addeditblogfrm')
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

    $('#divImage').on("click", function() {
        run_waitMe("blogsbyuserid");
        if (($('#nextsearindex').val() != undefined))
            startindex = $('#nextsearindex').val();

        var userid = "";
        if (($('#userid').val() != undefined))
            userid = $('#userid').val();

        console.log(startindex + " , " + userid);

        GetBlogsByUserID(startindex, userid, "edit");

        stop_waitMe("blogsbyuserid");
    });

    /* Code to add new blog */
    $("#addeditblogfrm").submit(function(e) {
        e.preventDefault();

        console.log("add");

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

        console.log(topic + "," + content + " , " + category + " , " + userid + " , " + actiontype);

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

        //var data = new FormData(this); // <-- 'this' is your form element

        var data = {};

        if (actiontype == "add") {
            data = {
                "topic": topic,
                "content": content,
                "category": category,
                "userid": userid,
                "createdby": createdby
            }
        } else if (actiontype == "edit") {
            data = {
                "_id": _id,
                "topic": topic,
                "content": content,
                "category": category,
                "modifiedby": modifiedby
            }
        }

        if (isValid) {
            run_waitMe("addeditblogfrm");
            $(".blogsuccesserrorpanel").html("");
            $.ajax({
                url: "/blogs/savedata/add",
                data: data,
                method: "POST",
                success: function(data) {
                    console.log("success : " + JSON.stringify(data));
                    msgPanel.append(
                        SuccessMessage("<strong>Thank You!</strong> New Blog is added.")
                    );
                    $(".blogsuccesserrorpanel").html(msgPanel).removeClass("hidden");
                    $("#divImage").removeClass("hidden");
                    //$(".profileprogress").imgProgressTo(profileCompleteStatus());

                    // Refresh accordion
                    GetBlogsByUserID(0, userid, "add");

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

    // $("#accordion").on("click", ".blogsbyuserid", function() {
    //     consol.log("clicked");
    // });

    // $(".ui-accordion-header-icon").click(function() {
    //     console.log("clicked");
    // });

    // $("#accordion").accordion({
    //     activate: function(event, ui) {
    //         console.log("after activate : " + ui.newHeader.text()); // For instance.
    //         $(".showblogdetails").removeClass("hidden");
    //         $(".blogeditform").addClass("hidden");
    //     }
    // });

    /* Code to update a blog */
    $(".saveblog").on("click", function(e) {
        e.preventDefault();

        console.log("add");

        var isValid = true;
        var msgPanel = $("<div></div>");
        var message = null;

        $(".blogeditvalidationpanel").html("");

        var _id = $(this).data("key");

        var modifiedby = $("#modifiedby_" + _id).val();
        var createdby = $("#createdby_" + _id).val();
        var status = $("#status_" + _id).val();
        var index = $("#index_" + _id).val();
        var userid = $("#userid_" + _id).val();
        var actiontype = $("#actiontype_" + _id).val();
        var topic = $("#topic_" + _id).val();
        var content = CKEDITOR.instances['content_' + _id].getData();
        var category = $("#category_" + _id).val();
        var creationdate = $("#creationdate_" + _id).val();

        console.log(topic + "," + content + " , " + category + " , " + userid + " , " + index + " ," + modifiedby + ", " + createdby + " ," + status + " , " + creationdate);

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
            "_id": _id,
            "topic": topic,
            "content": content,
            "category": category,
            "modifiedby": modifiedby,
            "index": index,
            "status": status,
            "userid": userid
        }

        console.log("Form :" + _id);

        if (isValid) {

            run_waitMe('blogeditform_' + _id);
            $('.blogeditsuccesserrorpanel').html("");
            $(".blogeditvalidationpanel").html("");

            $.ajax({
                url: "/blogs/savedata/edit",
                data: data,
                method: "POST",
                success: function(data) {
                    console.log("success : " + JSON.stringify(data));
                    msgPanel.append(
                        SuccessMessage("<strong>Thank You!</strong> [" + topic + "] Blog is updated successfully.")
                    );
                    $(".blogeditsuccesserrorpanel").html(msgPanel).removeClass("hidden");

                    $('.showblogdetails_' + _id).removeClass("hidden");
                    $('.blogeditform_' + _id).addClass("hidden");

                    $('.showblogdetails_' + _id).html("");
                    $('.showblogdetails_' + _id).html("<span class = 'blogpostdate glyphicon glyphicon-time' ></span> Posted on " +
                        creationdate + " " + content);

                    $('.blogheader_' + _id).html("");
                    $('.blogheader_' + _id).html(topic);

                    //$(".profileprogress").imgProgressTo(profileCompleteStatus());

                    // Refresh accordion
                    //GetBlogsByUserID(0, userid, "add");
                    //$("#divImage").removeClass("hidden");

                    stop_waitMe('blogeditform_' + _id);
                },
                error: function(error) {
                    console.log("error : " + error);
                    msgPanel.append(
                        ErrorMessage("<strong>Warning!</strong> error.")
                    );
                    $(".blogeditsuccesserrorpanel").html(msgPanel).removeClass("hidden");
                    stop_waitMe('blogeditform_' + _id);
                }
            });


        } else {
            $(".blogeditvalidationpanel").html(msgPanel).removeClass("hidden");
        }
    });
});

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

            console.log(JSON.stringify(data.blogs.count));

            if (actiontype == "add") {
                $("#divImage").removeClass("hidden");
                $('#nextsearindex').val(data.index);
            } else {
                if (json.blogs.count < 4) {
                    $("#divImage").addClass("hidden");
                    $('#nextsearindex').val(data.index);
                } else if ($('#nextsearindex').val() != undefined) {
                    var idx = $('#nextsearindex').val();
                    console.log("idx " + idx);
                    if (parseInt(data.index) + 1 > idx) {
                        $('#nextsearindex').val(data.index);
                        $("#divImage").removeClass("hidden");
                        // $("#divImage").addClass("show");
                    } else {
                        // $("#divImage").removeClass("show");
                        $("#divImage").addClass("hidden");
                    }
                }
            }
        });
    stop_waitMe("blogsbyuserid");
};

let GetBlogsBySIandUserID = (startindex, userid) => {
    console.log("GetBlogsBySIandUserID : startindex : " + startindex + ", userid : " + userid);
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

let GetBlogbyBlogID = (blogid) => {
    run_waitMe("addeditblogfrm");
    $.when(GetCompiledTemplate("blogsectionbyuserid"), RetrieveBlogByBlogID(blogid))
        .done(function(template, json) {

            console.log("1 " + json.blogs);

            var data = { "selectedBlogForEdit": json.selectedBlogForEdit, "category": json.category, "blogs": json.blogs };
            var compiledTemplate = Handlebars.compile(template);
            var newhtml = compiledTemplate(data);

            if (data.blogs.count == 1) {
                console.log("2");
                $(".addeditblogfrm").html("");
                $(".addeditblogfrm").html(newhtml);
                $(".addeditblogfrm").removeClass("hidden");
            }

            console.log(JSON.stringify(data.blogs.count));
        });
    stop_waitMe("addeditblogfrm");
};

let RetrieveBlogByBlogID = (_id) => {
    console.log("RetrieveBlogByBlogID : blogid : " + _id);
    var d = $.Deferred();

    $.ajax({
            method: "get",
            url: "/blogs/edit/" + _id
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

let DeleteBlogByID = (_id) => {
    var msgPanel = $("<div></div>");
    run_waitMe("addeditblogfrm");
    $('.blogeditsuccesserrorpanel').html("");
    $.ajax({
        url: "/blogs/delete/" + _id,
        method: "get",
        success: function(data) {
            msgPanel.append(
                SuccessMessage("Selected Blog is deleted successfully.")
            );
            $(".blogeditsuccesserrorpanel").html(msgPanel).removeClass("hidden");
            //$("#divImage").removeClass("hidden");
            //$(".profileprogress").imgProgressTo(profileCompleteStatus());

            // Refresh accordion
            //GetBlogsByUserID(0, userid, "add");

            $(".blog_" + _id).html("");

            stop_waitMe("addeditblogfrm");
        },
        error: function(error) {
            console.log("error : " + error);
            msgPanel.append(
                ErrorMessage("<strong>Warning!</strong> error.")
            );
            $(".blogeditsuccesserrorpanel").html(msgPanel).removeClass("hidden");
            stop_waitMe("addeditblogfrm");
        }
    });
};