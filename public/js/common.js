'use strict';
$(function() {
    $(".loginBtn").on("click", () => {
        $(".modalLogin").removeClass("hidden");
        // run_waitMe("signUp");
        //signUp(servicePath);
    });

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
            $('.blogdata .limitblogdata')[index].innerHTML = "<p>" + c + "</p>";
        }
    });
};