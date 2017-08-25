'use strict';
$(function() {
    var servicePath = $("#spnServicePath").text();
    $(".fpwdBtn").on("click", () => {
        run_waitMe("fpwd");
        fpwd(servicePath);
    });
});

let fpwd = (servicePath) => {
    var isValid = true;
    var _email = $("#inputEmail").val();
    $("#inputEmail").parent().removeClass("has-error");
    // debugger;
    // var errorPanel = $("<div></div>");
    if (_email == "" || _email == undefined) {
        isValid = false;
        $("#inputEmail").parent().addClass("has-error");
        $(".ErrorPanel").html("Please enter email.");
    } else if (!validateEmail(_email)) {
        isValid = false;
        $("#inputEmail").parent().addClass("has-error");
        $(".ErrorPanel").html("Please enter valid email.");
    }

    if (isValid) {
        var result = { "email": $("#inputEmail").val() };
        console.log("step 1");
        $.ajax({
                method: "Post",
                url: "/commonAPI/data/fpwd",
                data: result
            })
            .done(function(jsonResult) {
                console.log("step 2");
                if (jsonResult) {
                    $("#forgotPassword").addClass("hidden");
                    $("#inputEmail").val("");
                    $(".successPanel").html("<strong>Email has been send! Kindly check & click on link for updating password.</strong> <a href='/' class='alert-link'>Go to home page</a>");
                    showSuccessPanal();
                } else {
                    $("#inputEmail").focus().parent().addClass("has-error");
                    $(".ErrorPanel").html("Email not found.");
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
                stop_waitMe("fpwd");
            });
    } else {
        showErrorPanal();
        stop_waitMe("fpwd");
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