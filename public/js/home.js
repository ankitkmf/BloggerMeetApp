'use strict'
$(function() {

    var categorytype = "all";
    var startindex = 0;
    if (($('#nextsearindex').val() != undefined))
        startindex = $('#nextsearindex').val();

    if (startindex > 0) {
        $("#divImage").removeClass("hidden");
        $("#divImage").addClass("show");
    }

    $('#divImage').on("click", function() {
        if (($('#nextsearindex').val() != undefined))
            startindex = $('#nextsearindex').val();

        console.log(startindex + " , " + categorytype);

        GetBlogsInfo(startindex, categorytype);
    });

    $('.blogcategory').on("click", ".blogctid", function() {
        categorytype = $(this).data("key");
        GetBlogsInfo(0, categorytype);
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

            if (json.blogs.count < 4) {
                $("#divImage").removeClass("show");
                $("#divImage").addClass("hidden");
            } else if ($('#nextsearindex').val() != undefined) {
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
            url: "/commonapi/data/getblog/",
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
            url: "/commonapi/subscribe",
            method: "POST",
            data: { "emailID": $('#emailSubscribe').val(), "name": $('#nameSubscribe').val() }
        }).done(function(data) {
            $(".subscribeBlock").addClass("hidden");
            $(".successResult").removeClass("hidden");
        }).fail(function(err) {
            $(".subscribeBlock").addClass("hidden");
            $(".errorResult").removeClass("hidden");
        }).always(function() {

        });
    } else {
        $(".ErrorPanel").html(errorPanel).removeClass("hidden");
    }
}