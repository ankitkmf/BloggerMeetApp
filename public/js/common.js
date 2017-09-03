'use strict';
$(function() {


    $(".loginBtn").on("click", () => {
        //$(".modalLogin").removeClass("hidden");
        // run_waitMe("signUp");
        //signUp(servicePath);
    });

    $("textarea")
        .each(function() {
            this.setAttribute(
                "style",
                "height:" + this.scrollHeight + "px;overflow-y:hidden;"
            );
        })
        .on("input", function() {
            this.style.height = "auto";
            this.style.height = this.scrollHeight + "px";
        });
});

let GetCompiledTemplate = (fileName) => {
    var d = $.Deferred();
    $.ajax({
            method: "Get",
            url: "/template/" + fileName + ".handlebars",
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

let ErrorMessage = $message => {
    return $("<div class='alert alert-warning'></div>").append($message);
};
let setSpanErrorMessage = ($controlID, $message) => {
    setSpanRequiredErrorIcon($controlID);
    var errorSpan = "<span class='help-block'>" + $message + "</span>";
    $("#" + $controlID).parent().find(".msg").append(errorSpan);
};

let setSpanRequiredErrorIcon = ($controlID) => {
    var errorSpan = "<span class='glyphicon glyphicon-exclamation-sign  form-control-feedback'/>";
    $("#" + $controlID).parent().find(".msg").append(errorSpan);
};

let setSpanErrorMsgAndErrorIcon = ($controlID, $message) => {
    var errorSpanIcon = "<span class='glyphicon glyphicon-exclamation-sign  form-control-feedback'/>";
    var errorSpanMsg = "<span class='help-block'>" + $message + "</span>";
    $("#" + $controlID).parent().find(".msg").append(errorSpanIcon).append(errorSpanMsg);
};

let setErrorClass = $div => {
    return $("#" + $div).closest(".form-group").addClass("has-error").addClass("has-feedback");
};


let clearAllControls = $div => {
    $("." + $div).find(':input').each(function(index) {
        $("#" + $(this).attr("id")).parent().find(".msg").html('');
        $("#" + $(this).attr("id")).closest(".form-group")
            .removeClass("has-error")
            .removeClass("has-success")
            .removeClass("has-feedback");
    });
};