'use strict';
$(function() {
    var servicePath = $("#spnServicePath").text();
    $("#inputUserName").on("blur", () => {
        run_waitMe("userName");
        checkUserName(servicePath);
    });

    $("#inputEmail").on("blur", () => {
        run_waitMe("userEmail");
        checkUserEmail(servicePath);
    });

    $(".signupBtn").on("click", () => {
        run_waitMe("signUp");
        signUp(servicePath);
    });
});

let checkUserEmail = (servicePath) => {

    if ($("#inputEmail").val() == "" || $("#inputEmail").val() == undefined) {

        setErrorClass("inputEmail");
        setSpanErrorMsgAndErrorIcon("inputEmail", "Please enter email.");
        $("#inputEmail").focus();
        stop_waitMe("userEmail");
    } else if (!validateEmail($("#inputEmail").val())) {
        setErrorClass("inputEmail");
        setSpanErrorMsgAndErrorIcon("inputEmail", "Please enter valid email.");
        $("#inputEmail").focus();
        stop_waitMe("userEmail");
    } else {

        servicePath = servicePath != null ? servicePath : "http://localhost:3000";
        var url = "/commonAPI/data/checkUserEmail"; // servicePath + "/validateUserEmail";
        var result = {
            "email": $("#inputEmail").val()
        };
        $.ajax({
            method: "Post",
            url: url, // "https://www.emirates.com/api/fares/featured/uk/english/LHR",   
            // dataType: 'json',
            data: result,
            success: function(data) {
                console.log("Data:" + JSON.stringify(data));
                if (!data) {
                    setErrorClass("inputEmail");
                    $("#inputEmail").focus();
                    setSpanErrorMsgAndErrorIcon("inputEmail", "Email already taken");
                } else {
                    setSuccessClass("inputEmail");
                    setSuccessFeedbackIcon("inputEmail");
                }
                stop_waitMe("userEmail");
            },
            error: function(err) {
                $("#inputEmail").focus();
                setErrorClass("inputEmail");
                setSpanErrorMsgAndErrorIcon("inputEmail", "<strong>Oh sanp!</strong> there some technical error");
                stop_waitMe("userEmail");
            }
        });
    }
}

let checkUserName = (servicePath) => {

    if ($("#inputUserName").val() == "" || $("#inputUserName").val() == undefined) {
        setErrorClass("inputUserName");
        setSpanErrorMsgAndErrorIcon("inputUserName", "Please enter user name.");
        stop_waitMe("userName");
        $("#inputUserName").focus()

    } else {

        //servicePath = servicePath != null ? servicePath : "http://localhost:3000";
        //var url = servicePath + "/checkUserName/" + $("#inputUserName").val();

        servicePath = servicePath != null ? servicePath : "http://localhost:3000";
        var url = "/commonAPI/data/checkUserName"; // servicePath + "/validateUserEmail";
        var result = {
            "username": $("#inputUserName").val()
        };

        $.ajax({
            method: "Post",
            url: url, // "https://www.emirates.com/api/fares/featured/uk/english/LHR",   
            //dataType: 'json',
            data: result,
            success: function(data) {
                if (!data) {
                    setErrorClass("inputUserName");
                    $("#inputUserName").focus();
                    setSpanErrorMsgAndErrorIcon("inputUserName", "User-name already taken");
                } else {
                    setSuccessClass("inputUserName");
                    setSuccessFeedbackIcon("inputUserName");
                }

                stop_waitMe("userName");
            },
            error: function(err) {
                setErrorClass("inputUserName");
                setSpanErrorMsgAndErrorIcon("inputUserName", "<strong>Oh sanp!</strong> there some technical error");
                stop_waitMe("userName");
            }
        });
    }
}

let showMessage = ($message) => {
    return $("<div></div>").append($message);
};

let signUp = (servicePath) => {
    clearControlClass();
    // signUPValidation();
    if (signUPValidation()) {
        //if (false) {
        // hideAllPanel();
        var result = {
            "username": $("#inputUserName").val(),
            "name": $("#inputName").val(),
            "email": $("#inputEmail").val(),
            "password": $("#inputPassword").val()
        };
        $.ajax({
                method: "Post",
                url: "/commonAPI/data/signUp",
                data: result
            })
            .done(function(jsonResult) {
                if (jsonResult) {
                    clearControlClass();
                    $("#userRegistration").addClass("hidden");
                    $(".successPanel").html("<strong>Well done! You have successfully signed up.</strong> <a href='/' class='alert-link'>Go to home page</a>");
                    showSuccessPanal();
                    clearInputFields();

                } else {}
                console.log("jsonResult:" + JSON.stringify(jsonResult));
            })
            .fail(function(err) {
                showErrorPanal();
                console.log("post error:" + JSON.stringify(err));
            })
            .always(function() {
                stop_waitMe("signUp");
            });
    }
}

let signUPValidation = () => {
    var isValid = true;
    var errorPanel = $("<div></div>");
    var _userName = $("#inputUserName").val();
    var _name = $("#inputName").val();
    var _email = $("#inputEmail").val();
    var _pwd = $("#inputPassword").val();
    var _cpwd = $("#inputCPassword").val();
    clearAllControls("signUp");
    if (_userName == "" || _userName == undefined) {
        isValid = false;
        setErrorClass("inputUserName");
        setSpanErrorMsgAndErrorIcon("inputUserName", "Please enter user name.");
    }

    if (_name == "" || _name == undefined) {
        isValid = false;
        setErrorClass("inputName");
        setSpanErrorMsgAndErrorIcon("inputName", "Please enter name.");
    } else if (!validateName(_name)) {
        isValid = false;
        setErrorClass("inputName");
        setSpanErrorMsgAndErrorIcon("inputName", "Please enter valid name.");
    }

    if (_email == "" || _email == undefined) {
        isValid = false;
        setErrorClass("inputEmail");
        setSpanErrorMsgAndErrorIcon("inputEmail", "Please enter email.");
    } else if (!validateEmail(_email)) {
        isValid = false;
        setErrorClass("inputEmail");
        setSpanErrorMsgAndErrorIcon("inputEmail", "Please enter valid email.");
    }

    if (_pwd == "" || _pwd == undefined) {
        isValid = false;
        setErrorClass("inputPassword");
        setSpanErrorMsgAndErrorIcon("inputPassword", "Please enter password.");
    }

    if (_cpwd == "" || _cpwd == undefined) {
        isValid = false;
        setErrorClass("inputCPassword");
        setSpanErrorMsgAndErrorIcon("inputCPassword", "Please enter confirm password.");
    }

    if (_pwd != _cpwd) {
        isValid = false;
        setErrorClass("inputCPassword");
        setSpanErrorMsgAndErrorIcon("inputCPassword", "Password is not matching");
    }
    if (!isValid) {
        stop_waitMe("signUp");
    }
    return isValid;
};

let showErrorPanal = () => {
    $(".ErrorPanel").removeClass("hidden");
    $(".successPanel").addClass("hidden");
};

let showSuccessPanal = () => {
    $(".ErrorPanel").addClass("hidden");
    $(".successPanel").removeClass("hidden");
};

let hideAllPanel = () => {
    $(".ErrorPanel").addClass("hidden");
    $(".successPanel").addClass("hidden");
};

let clearControlClass = () => {

    $("input").each(function(index) {
        $("#" + $(this).attr("id")).parent().removeClass("has-error");
        // console.log(index + ": " + $(this).attr("id"));
    });
};

let clearInputFields = () => {
    $("input").each(function(index) {
        // console.log(index + ": " + $("#" + $(this).attr("id")).val());
        $("#" + $(this).attr("id")).val("");
    });
};