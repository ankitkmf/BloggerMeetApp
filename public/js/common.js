'use strict';
$(function() {

    if ($("#hdnErrorMsg").val()) {
        console.log("1:" + $("#hdnErrorMsg").val());
        $.bootstrapGrowl($("#hdnErrorMsg").val(), {
            type: 'danger',
            align: 'center',
            width: 'auto',
            allow_dismiss: false,
            delay: 3000
        });
        // $.bootstrapGrowl("another message, yay!", {
        //     ele: 'body', // which element to append to
        //     type: 'info', // (null, 'info', 'danger', 'success')
        //     offset: { from: 'top', amount: 20 }, // 'top', or 'bottom'
        //     align: 'right', // ('left', 'right', or 'center')
        //     width: 250, // (integer, or 'auto')
        //     delay: 4000000, // Time while the message will be displayed. It's not equivalent to the *demo* timeOut!
        //     allow_dismiss: true, // If true then will display a cross to close the popup.
        //     stackup_spacing: 10 // spacing between consecutively stacked growls.
        // });
    } else
        console.log("2:" + $("#hdnErrorMsg").val());

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

    Handlebars.registerHelper("CovertISODate", function(isodate) {
        if (isodate != undefined) {
            return new Date(isodate).toUTCString();
        }
    });

    $(".loginBtn").on("click", () => {
        //$(".modalLogin").removeClass("hidden");
        // run_waitMe("signUp");
        //signUp(servicePath);
    });

    $("textarea")
        .each(function() {
            this.setAttribute(
                "style",
                "height:" + ((this.scrollHeight == 0) ? 100 : this.scrollHeight) + "px;overflow-y:hidden;"
            );
        })
        .on("input", function() {

            this.style.height = "auto";
            this.style.height = this.scrollHeight + "px";
        });

    //         $("input[type='text']").each(function() {
    //     $(this).blur(function(e) {
    //         if (Validate(this.id)) {} else { alert('invalid input'); }
    //     });
    // });


});

let alphanumericinputvalidation = (evt) => {
    var isValid = false;
    var regex = /^([\s]?[a-zA-Z0-9]+)+$/;
    isValid = regex.test($("#" + evt).val());
    return isValid;
}

let alphaiputvalidation = (evt) => {
    var isValid = false;
    var regex = /^([\s]?[a-zA-Z]+)+$/;
    isValid = regex.test($("#" + evt).val());
    return isValid;
}

let onlyalphaiputvalidation = (evt) => {
    var isValid = false;
    var regex = /^([a-zA-Z]+)+$/;
    isValid = regex.test($("#" + evt).val());
    return isValid;
}

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

let SuccessMessage = $message => {
    return $("<div class='alert alert-success'></div>").append($message);
};

$.getJSON("/commonapi/data/countries")
    .done(function(data) {
        var result = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: data
        });
        $("#bloodhound .typeahead").typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        }, {
            name: "states",
            source: result
        });
    })
    .fail(function(jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
    });

let setSuccessFeedbackIcon = ($controlID) => {
    var successSpanIcon = "<span class='glyphicon glyphicon-ok form-control-feedback feedbackOK '/>";
    removeErrorClass($controlID);
    removeSpanErrorMsgAndIcon($controlID);
    $("#" + $controlID).parent().parent().find(".msg").html(successSpanIcon);
};

let setSpanErrorMessage = ($controlID, $message) => {
    setSpanRequiredErrorIcon($controlID);
    var errorSpan = "<span class='help-block'>" + $message + "</span>";
    $("#" + $controlID).parent().parent().find(".msg").append(errorSpan);
};

let removeSpanErrorMsgAndIcon = ($controlID) => {
    setSpanRequiredErrorIcon($controlID);
    // var errorSpan = "<span class='help-block'>" + $message + "</span>";
    $("#" + $controlID).parent().parent().find(".msg").html('');
};

let setSpanRequiredErrorIcon = ($controlID) => {
    var errorSpan = "<span class='glyphicon glyphicon-exclamation-sign  form-control-feedback'/>";
    $("#" + $controlID).parent().parent().find(".msg").append(errorSpan);
};

let setSpanErrorMsgAndErrorIcon = ($controlID, $message) => {
    var errorSpanIcon = "<span class='glyphicon glyphicon-exclamation-sign  form-control-feedback'/>";
    var errorSpanMsg = "<span class='help-block'>" + $message + "</span>";
    $("#" + $controlID).parent().parent().find(".msg").html('').append(errorSpanIcon).append(errorSpanMsg);
};

let setErrorClass = $div => {
    $("#" + $div).parent().parent().find(".msg").html('');
    return $("#" + $div).closest(".form-group").addClass("has-error").addClass("has-feedback").removeClass("has-success");
};

let setSuccessClass = $div => {
    return $("#" + $div).closest(".form-group").addClass("has-success").addClass("has-feedback");
};

let removeErrorClass = $div => {
    return $("#" + $div).closest(".form-group").removeClass("has-error");
};

let removeFeedbackClass = $div => {
    return $("#" + $div).closest(".form-group").removeClass("has-feedback");
};

let clearAllControls = $div => {
    $("." + $div).find(':input').each(function(index) {
        $("#" + $(this).attr("id")).parent().parent().find(".msg").html('');
        $("#" + $(this).attr("id")).closest(".form-group")
            .removeClass("has-error")
            .removeClass("has-success")
            .removeClass("has-feedback");
    });
};