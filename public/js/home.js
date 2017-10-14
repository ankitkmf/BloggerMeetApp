'use strict'
$(function() {

    var categorytype = "all";
    var lastblogid = "0";
    var userid = "";

    var blogid = $('#divImage').data("lastblogid");
    if (blogid == "0") $('#divImage').addClass("hidden");

    $('#divImage').on("click", function() {
        lastblogid = $(this).data("lastblogid");
        userid = $(this).data("userid");

        // console.log("divImage clicked");

        GetBlogsInfo(lastblogid, categorytype, userid);
    });

    $('.blogcategory').on("click", ".blogctid", function() {
        categorytype = $(this).data("key");
        console.log(categorytype);
        GetBlogsInfo("0", categorytype, userid);
    })

    limitBlogLength();

    $(".subscribe").on("click", function() {
        console.log("subscribe");
        subscribeuser();
    });

});

let limitBlogLength = () => {
    $('.blogdata .limitblogdata').each(function(index, value) {
        var showlength = 100;
        var data = $(value).text();
        if (data.length > showlength) {
            var c = data.substring(0, showlength);
            $('.blogdata .limitblogdata')[index].innerHTML = "";
            $('.blogdata .limitblogdata')[index].innerHTML = "<p>" + c + "...</p>";
        }
    });
};

let GetBlogsInfo = (lastblogid, categorytype, userid) => {
    run_waitMe("blogdata");
    $.when(GetCompiledTemplate("blogsection"), GetBlogsByStartIndex(lastblogid, categorytype))
        .done(function(template, json) {

            //console.log("User ID : " + userid);

            var data = { "lastblogid": json.lastblogid, "blogs": json.blogs, "userid": userid };

            var compiledTemplate = Handlebars.compile(template);
            var newhtml = compiledTemplate(data);

            if (lastblogid == "0" && categorytype != "all")
                $(".blogdata").html(newhtml);
            else
                $(".blogdata").append(newhtml);

            limitBlogLength();

            lastblogid = json.lastblogid;

            $("#divImage").removeData("lastblogid");
            $("#divImage").data("lastblogid", lastblogid);

            if (json.blogs.count < 4)
                $("#divImage").addClass("hidden");
            else
                $("#divImage").removeClass("hidden");
        });
    stop_waitMe("blogdata");
};

let GetBlogsByStartIndex = (lastblogid, categorytype) => {
    console.log("GetBlogsByStartIndex : lastblogid : " + lastblogid + ", Category : " + categorytype);
    var d = $.Deferred();

    $.ajax({
            method: "post",
            url: "/commonapi/data/getblog/",
            data: { "lbid": lastblogid, "ct": categorytype }
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

let subscribeuser = () => {
    var isValid = true;
    var errorPanel = $("<div></div>");
    var errorMessage = null;

    if ($("#nameSubscribe").val() == "" || $("#nameSubscribe").val() == undefined) {
        isValid = false;
        errorPanel.append(
            ErrorMessage("<strong>Warning!</strong> Please enter name.")
        );
    } else if (!validateName($("#nameSubscribe").val())) {
        isValid = false;
        errorPanel.append(
            ErrorMessage(" <strong>Warning!</strong> Please enter valid Name.")
        );
    }

    if ($("#emailSubscribe").val() == "" || $("#emailSubscribe").val() == undefined) {
        isValid = false;
        errorPanel.append(
            ErrorMessage("<strong>Warning!</strong> Please enter email.")
        );
    } else if (!validateEmail($("#emailSubscribe").val())) {
        isValid = false;
        errorPanel.append(
            ErrorMessage("<strong>Warning!</strong> Please enter valid email.")
        );
    }

    if (isValid) {
        $(".ErrorPanel").html("");
        $.ajax({
            url: "/commonapi/subscribe/",
            method: "get",
            data: {
                emailID: $('#emailSubscribe').val(),
                name: $('#nameSubscribe').val()
            }
        }).done(function(data) {
            $(".subscribeBlock").addClass("hidden");
            $(".successResult").removeClass("hidden");
        }).fail(function(err) {
            $(".subscribeBlock").addClass("hidden");
            $(".errorResult").removeClass("hidden");
        });
    } else {
        $(".ErrorPanel").html(errorPanel).removeClass("hidden");
    }
}