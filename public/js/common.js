'use strict';
$(function() {

    var categorytype = "all";
    var startindex = 0;
    if (($('#nextsearindex').val() != undefined))
        startindex = $('#nextsearindex').val();

    $(".loginBtn").on("click", () => {
        $(".modalLogin").removeClass("hidden");
        // run_waitMe("signUp");
        //signUp(servicePath);
    });

    // $('#divImage').on("click", function() {
    //     if (($('#nextsearindex').val() != undefined))
    //         startindex = $('#nextsearindex').val();
    //     GetBlogsInfo(startindex, categorytype);
    // });

    limitBlogLength();

});

let GetCompiledTemplate = (fileName) => {
    var d = $.Deferred();
    $.ajax({
            method: "Get",
            url: "/templates/" + fileName + ".handlebars",
            dataType: "text"
        })
        .done(function(data) {
            d.resolve(data);
        })
        .fail(function() {
            d.reject;
        })
        .always(function() {});
    return d.promise();
};

let run_waitMe = (divClass, animation) => {
    divClass = divClass != null ? divClass : "userInfoDiv";
    animation = animation != null ? animation : "facebook";
    $("." + divClass).waitMe({
        effect: animation,
        text: "",
        bg: "rgba(255,255,255,0.7)",
        color: "#000",
        sizeW: "",
        sizeH: "",
        source: "",
        onClose: function() {}
    });
};

let stop_waitMe = (divClass, animation) => {
    divClass = divClass != null ? divClass : "userInfoDiv";
    animation = animation != null ? animation : "timer";
    $("." + divClass).waitMe("hide");
};

let validateEmail = $email => {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test($email);
};

let validateName = $name => {
    var NameReg = /^[a-zA-Z\s]+$/;
    return NameReg.test($name);
};

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

let GetBlogsInfo = (startindex, categorytype) => {
    run_waitMe("blogdata");
    $.when(GetCompiledTemplate("blogsection"), GetBlogsByStartIndex(startindex, categorytype))
        .done(function(template, json) {

            var data = { "index": json.index, "blogs": json.blogs };
            var compiledTemplate = Handlebars.compile(template);
            var newhtml = compiledTemplate(data);

            if (startindex == 0 && categorytype != "all")
                $(".blogdata").html(newhtml);
            else
                $(".blogdata").append(newhtml);

            limitBlogLength();

            if ($('#nextsearindex').val() != undefined) {
                var idx = $('#nextsearindex').val();
                if (parseInt(data.index) + 1 > idx) {
                    $('#nextsearindex').val(data.index);
                    $("#divImage").removeClass("hidden");
                    $("#divImage").addClass("show");
                } else {
                    $("#divImage").removeClass("show");
                    $("#divImage").addClass("hidden");
                }
            }
        });
    stop_waitMe("blogdata");
};

let GetBlogsByStartIndex = (startindex, categorytype) => {
    console.log("GetBlogsByStartIndex : startindex : " + startindex + ", Category : " + categorytype);
    var d = $.Deferred();

    $.ajax({
            method: "post",
            url: "/commonapi/data/blog/",
            data: { "si": startindex, "ct": categorytype }
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