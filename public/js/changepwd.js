'use strict';
$(function() {
    var servicePath = $("#spnServicePath").text();
    $(".cpwdBtn").on("click", () => {
        run_waitMe("changepwd");
        changePwd(servicePath);
    });

    $(".resetpwdBtn").on("click", () => {
        run_waitMe("resetpwd");
        resetPwd(servicePath);
    });

});

let changePwd = (servicePath) => {
    var isValid = true;
    var errorPanel = $("<div></div>");
    var _cupwd = $("#CuPassword").val();
    var _npwd = $("#NPassword").val();
    var _conpwd = $("#CoPassword").val();
    var _userID = $("#CuPassword").data("id")
    clearControlClass();
    if (_cupwd == "" || _cupwd == undefined) {
        isValid = false;
        $("#CuPassword").parent().addClass("has-error");
        errorPanel.append(showMessage("Please enter cuurrent password."));
    }

    if (_npwd == "" || _npwd == undefined) {
        isValid = false;
        $("#NPassword").parent().addClass("has-error");
        errorPanel.append(showMessage("Please enter new password."));
    }

    if (_conpwd == "" || _conpwd == undefined) {
        isValid = false;
        $("#CoPassword").parent().addClass("has-error");
        errorPanel.append(showMessage("Please enter confirm password."));
    }

    if (_npwd != _conpwd) {
        isValid = false;
        $("#CoPassword").parent().addClass("has-error");
        errorPanel.append(showMessage("Password is not matching"));
    }

    if (isValid && (_userID != "" || _userID != undefined)) {
        var result = { "cupwd": _cupwd, "id": _userID, "npwd": _npwd };
        console.log("step 1");
        $.ajax({
                method: "Post",
                url: "/commonAPI/data/ValidateUserPwd",
                data: result
            })
            .done(function(jsonResult) {
                console.log("step 2");
                if (jsonResult) {
                    clearControlClass();
                    clearInputFields();
                    $(".successPanel").html("<strong>Your password has been reset! Kindly login.</strong> <a href='/' class='alert-link'>Go to home page</a>");
                    showSuccessPanal();
                } else {
                    $("#inputEmail").focus().parent().addClass("has-error");
                    $(".ErrorPanel").html("Current password not matching");
                    showErrorPanal();
                }
            })
            .fail(function(err) {
                $("#inputEmail").focus().parent().addClass("has-error");
                $(".ErrorPanel").html("Technical error !");
                showErrorPanal();
            })
            .always(function() {
                console.log("step 6");
                stop_waitMe("changepwd");
            });
    } else {
        $(".ErrorPanel").html(errorPanel);
        showErrorPanal();
        stop_waitMe("changepwd");
    }
}

let resetPwd = (servicePath) => {
    var isValid = true;
    var errorPanel = $("<div></div>");
    var _npwd = $("#NPassword").val();
    var _conpwd = $("#CoPassword").val();
    var _userID = $("#NPassword").data("id")
    clearControlClass();
    if (_npwd == "" || _npwd == undefined) {
        isValid = false;
        $("#NPassword").parent().addClass("has-error");
        errorPanel.append(showMessage("Please enter new password."));
    }

    if (_conpwd == "" || _conpwd == undefined) {
        isValid = false;
        $("#CoPassword").parent().addClass("has-error");
        errorPanel.append(showMessage("Please enter confirm password."));
    }

    if (_npwd != _conpwd) {
        isValid = false;
        $("#CoPassword").parent().addClass("has-error");
        errorPanel.append(showMessage("Password is not matching"));
    }

    if (isValid && (_userID != "" || _userID != undefined)) {
        var result = { "_id": _userID, "npwd": _npwd };
        console.log("step 1 " + JSON.stringify(result));
        $.ajax({
                method: "Post",
                url: "/commonAPI/data/ResetUserPwd",
                data: result
            })
            .done(function(jsonResult) {
                console.log("step 2");
                if (jsonResult) {
                    clearControlClass();
                    clearInputFields();
                    $(".successPanel").html("<strong>Your password has been reset! Kindly login.</strong> <a href='/' class='alert-link'>Go to home page</a>");
                    showSuccessPanal();
                } else {
                    $("#inputEmail").focus().parent().addClass("has-error");
                    $(".ErrorPanel").html("Technical error !");
                    showErrorPanal();
                }
            })
            .fail(function(err) {
                $("#inputEmail").focus().parent().addClass("has-error");
                $(".ErrorPanel").html("Technical error !");
                showErrorPanal();
            })
            .always(function() {
                console.log("step 6");
                stop_waitMe("resetpwd");
            });
    } else {
        $(".ErrorPanel").html(errorPanel);
        showErrorPanal();
        stop_waitMe("resetpwd");
    }
}

let hideAllPanel = () => {
    $(".ErrorPanel").addClass("hidden");
    $(".successPanel").addClass("hidden");
};

let showErrorPanal = () => {
    $(".ErrorPanel").removeClass("hidden");
    $(".successPanel").addClass("hidden");
};

let showSuccessPanal = () => {
    $(".ErrorPanel").addClass("hidden");
    $(".successPanel").removeClass("hidden");
};

let showMessage = ($message) => {
    return $("<div></div>").append($message);
};

let clearControlClass = () => {
    $("input").each(function(index) {
        $("#" + $(this).attr("id")).parent().removeClass("has-error");
        // console.log(index + ": " + $(this).attr("id"));
    });
};

let clearInputFields = () => {
    $("input").each(function(index) {
        $("#" + $(this).attr("id")).val("");
    });
};