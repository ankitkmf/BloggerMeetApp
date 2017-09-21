$(function() {
    var servicePath = $("#spnServicePath").text();

    $("#inputName").on("blur", () => {
        checkName();
    });

    $("#inputEmail").on("blur", () => {
        checkEmail();
    });

    $("#inputMobile").on("blur", () => {
        checkMobile();
    });

    $(".contactusbtn").on("click", () => {
        run_waitMe("contactus");
        contactus(servicePath);
    });
});

let checkName = () => {
    if ($("#inputName").val().trim() == "" || $("#inputName").val() == undefined) {
        setErrorClass("inputName");
        setSpanErrorMsgAndErrorIcon("inputName", "Please enter your name.");
        $("#inputName").focus();
    } else if (!alphaiputvalidation("inputName")) {
        setErrorClass("inputName");
        setSpanErrorMsgAndErrorIcon("inputName", "Name can have only alphabates.");
        $("#inputName").focus();
    } else {
        setSuccessClass("inputName");
        setSuccessFeedbackIcon("inputName");
    }
}

let checkEmail = () => {
    if ($("#inputEmail").val() == "" || $("#inputEmail").val() == undefined) {
        setErrorClass("inputEmail");
        setSpanErrorMsgAndErrorIcon("inputEmail", "Please enter email.");
        $("#inputEmail").focus();
    } else if (!validateEmail($("#inputEmail").val())) {
        setErrorClass("inputEmail");
        setSpanErrorMsgAndErrorIcon("inputEmail", "Please enter valid email.");
        $("#inputEmail").focus();
    } else {
        setSuccessClass("inputEmail");
        setSuccessFeedbackIcon("inputEmail");
    }
}

let checkMobile = () => {
    if ($("#inputMobile").val().trim() == "" || $("#inputMobile").val() == undefined) {
        setErrorClass("inputMobile");
        setSpanErrorMsgAndErrorIcon("inputMobile", "Please enter your contact number.");
        $("#inputMobile").focus();
    } else if (!($.isNumeric($("#inputMobile").val()))) {
        setErrorClass("inputMobile");
        setSpanErrorMsgAndErrorIcon("inputMobile", "Please enter valid contact number.");
        $("#inputMobile").focus();
    } else {
        setSuccessClass("inputMobile");
        setSuccessFeedbackIcon("inputMobile");
    }
}

let contactus = (servicePath) => {
    clearControlClass();

    console.log($("#inputReqType").val());

    if (contactusValidation()) {

        var result = {
            "name": $("#inputName").val(),
            "email": $("#inputEmail").val(),
            "mobile": $("#inputMobile").val(),
            "reqtypekey": $("#inputReqType").val(),
            "comment": $("#inputReqData").val()
        };
        $.ajax({
                method: "Post",
                url: "/contactus/sendquery",
                data: result
            })
            .done(function(jsonResult) {
                if (jsonResult) {
                    clearControlClass();
                    $("#userRegistration").addClass("hidden");
                    $(".successPanel").html("<strong>Thank you for submitting your query.</strong> <a href='/' class='alert-link'>Go to home page</a>");
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
                stop_waitMe("contactus");
            });
    }
}

let contactusValidation = () => {
    var isValid = true;
    var errorPanel = $("<div></div>");
    var _name = $("#inputName").val();
    var _email = $("#inputEmail").val();
    var _mobile = $("#inputMobile").val();
    var _reqtype = $("#inputReqType").val();
    var _reqdata = $("#inputReqData").val();

    clearAllControls("contactus");

    if (_mobile.trim() == "" || _mobile == undefined) {
        isValid = false;
        setErrorClass("inputMobile");
        setSpanErrorMsgAndErrorIcon("inputMobile", "Please enter contact number.");
    }

    if (_name.trim() == "" || _name == undefined) {
        isValid = false;
        setErrorClass("inputName");
        setSpanErrorMsgAndErrorIcon("inputName", "Please enter name.");
    }

    if (_email.trim() == "" || _email == undefined) {
        isValid = false;
        setErrorClass("inputEmail");
        setSpanErrorMsgAndErrorIcon("inputEmail", "Please enter email.");
    }

    if (_reqtype == "0") {
        isValid = false;
        setErrorClass("inputReqType");
        setSpanErrorMsgAndErrorIcon("inputReqType", "Please select a valid request type.");
    }

    if (_reqdata == "" || _reqdata == undefined) {
        isValid = false;
        setErrorClass("inputReqData");
        setSpanErrorMsgAndErrorIcon("inputReqData", "Please add your query.");
    }

    if (!isValid) {
        stop_waitMe("contactus");
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