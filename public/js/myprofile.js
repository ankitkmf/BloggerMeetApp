'use strict';
$(function() {

    $("#inputDOB").datepicker();

    // Edit profile photo
    $("#checker").on("click", () => {
        if ($("#checker").is(':checked')) {
            $(".Successpanel").addClass("hidden");
            $(".uploadprofilephoto").attr("style", "display:block");
        } else {
            $(".uploadprofilephoto").attr("style", "display:none");
        }
    });

    // Edit 'about me'
    $("#checkeraboutme").on("click", () => {
        if ($("#checkeraboutme").is(':checked')) {
            $(".amsuccessResult").addClass("hidden");
            $(".amerrorResult").addClass("hidden");
            $(".amerrorpanel").addClass("hidden");
            $(".saveaboutmeinfo").removeClass("hidden");
        } else {
            $(".saveaboutmeinfo").addClass("hidden");
        }
    });

    // Edit 'personal details'
    $("#checkerpersonalinfo").on("click", () => {
        console.log("hi " + $("#checkerpersonalinfo").is(':checked'));
        if ($("#checkerpersonalinfo").is(':checked')) {
            $(".pderrorPanel").addClass("hidden");
            $(".pdsuccessResult").addClass("hidden");
            $(".pderrorResult").addClass("hidden");
            $(".savepersonalinfo").removeClass("hidden");
        } else {
            $(".savepersonalinfo").addClass("hidden");
        }
    });

    $(".hideuploadform").on("click", () => {
        $("#displayImage").val("");
        $(".Successpanel").addClass("hidden");
        $(".uploadprofilephoto").attr("style", "display:none;");
        $("#checker").attr("checked", false);
    });

    $("#frmaboutme .clearmsg").on("focus", () => {
        $(".amerrorpanel").html("");
        $(".amerrorResult").addClass("hidden");
        $(".amsuccessResult").addClass("hidden");
    });

    $("#frmaboutme .hidefrmaboutme").on("click", () => {
        $(".saveaboutmeinfo").addClass("hidden");
        $("#checkeraboutme").attr("checked", false);
    });

    $("#frmpersonaldetails .hidefrmpersonaldetails").on("click", () => {
        $(".savepersonalinfo").addClass("hidden");
        $("#checkerpersonalinfo").attr("checked", false);
    });

    /* Code to upload profile image in the my profile page */
    $("#uploadform").submit(function(e) {
        e.preventDefault();

        var isValid = true;
        var errorPanel = $("<div></div>");
        var errorMessage = null;
        var filename = $("#displayImage").val();
        var extension = getFileExtension(filename);

        $(".Successpanel").addClass("hidden");

        if (filename == "" || filename == undefined) {
            isValid = false;
            console.log("No file selected");
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please select an image file.")
            );
        } else {
            if (extension == "") {
                isValid = false;
                errorPanel.append(
                    ErrorMessage(
                        "<strong>Warning!</strong> Please select .jpg/.jpeg/.png/.gif file only."
                    )
                );
            }
        }

        var data = new FormData(this); // <-- 'this' is your form element

        if (isValid) {
            run_waitMe("uploadphotostatus");
            $(".ErrorPanel").html("");
            $.ajax({
                url: "/myprofile/uploadphoto",
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: "POST",
                success: function(data) {
                    console.log("success : " + JSON.stringify(data));
                    if (data.error == "IFE") {
                        console.log("invalid file extension");
                        $("#displayImage").val("");
                        errorPanel.append(
                            ErrorMessage(
                                "<strong>Warning!</strong> Please select .jpg/.jpeg/.png/.gif file only."
                            )
                        );
                        $(".ErrorPanel").html(errorPanel).removeClass("hidden");
                        stop_waitMe("uploadphotostatus");
                    } else {
                        $(".reloadimage").attr(
                            "src",
                            data.filepath + "?" + new Date().getTime()
                        );
                        $("#displayImage").val("");
                        $(".Successpanel").removeClass("hidden");
                        $(".uploadprofilephoto").attr("style", "display:none;");
                        $("#checker").attr("checked", false);
                        // $(".profileprogress").imgProgressTo(profileCompleteStatus());
                        stop_waitMe("uploadphotostatus");
                    }
                },
                error: function(error) {
                    console.log("error : " + error);
                }
            });
        } else {
            $(".ErrorPanel").html(errorPanel).removeClass("hidden");
        }
    });

    /* Code to update about me section in the my profile page */
    $("#frmaboutme").submit(function(e) {
        e.preventDefault();

        var isValid = true;
        var errorPanel = $("<div></div>");
        var errorMessage = null;
        var content = $("#aboutme").val();

        if (content == "" || content == undefined) {
            isValid = false;
            console.log("No data");
            errorPanel.append(
                ErrorMessage(
                    "<strong>Warning!</strong> Please add few lines about you."
                )
            );
        }

        var data = new FormData(this); // <-- 'this' is your form element

        if (isValid) {
            $(".amerrorpanel").html("");
            $.ajax({
                url: "/myprofile/updateaboutme",
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: "POST",
                success: function(data) {
                    console.log("success : " + JSON.stringify(data));
                    $(".amsuccessResult").removeClass("hidden");
                    $(".amerrorResult").addClass("hidden");
                    $(".saveaboutmeinfo").addClass("hidden");
                    //$(".profileprogress").imgProgressTo(profileCompleteStatus());
                },
                error: function(error) {
                    console.log("error : " + error);
                    $(".amsuccessResult").addClass("hidden");
                    $(".amerrorResult").removeClass("hidden");
                }
            });
        } else {
            $(".amerrorpanel").html(errorPanel).removeClass("hidden");
        }
    });

    /* Code to update personal details in the my profile page */
    $("#frmpersonaldetails").submit(function(e) {
        e.preventDefault();

        var isValid = true;
        var errorPanel = $("<div></div>");
        var errorMessage = null;
        var regex = /^[a-zA-Z ]+$/;

        var firstname = $("#inputfirstname").val();
        var lastname = $("#inputlastname").val();
        var phone = $("#inputphone").val();

        if (firstname == "" || firstname == undefined) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add your First Name.")
            );
        } else if (firstname != firstname.match(regex)) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Only alphabate for first name.")
            );
        }

        if (lastname == "" || lastname == undefined) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add your last name.")
            );
        } else if (lastname != lastname.match(regex)) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Only alphabate for last name.")
            );
        }

        if (phone != "" && !($.isNumeric(phone))) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Only digit for Contact number.")
            );
        }

        var data = new FormData(this); // <-- 'this' is your form element

        if (isValid) {
            $(".pderrorPanel").html("");
            $.ajax({
                url: "/myprofile/updatepersonaldetails",
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: "POST",
                success: function(data) {
                    console.log("success : " + JSON.stringify(data));
                    $(".pderrorResult").addClass("hidden");
                    $(".pdsuccessResult").removeClass("hidden");
                    //$(".profileprogress").imgProgressTo(profileCompleteStatus());
                },
                error: function(error) {
                    console.log("error : " + error);
                    $(".pdsuccessResult").addClass("hidden");
                    $(".pderrorResult").removeClass("hidden");
                }
            });
        } else {
            $(".pderrorPanel").html(errorPanel).removeClass("hidden");
        }
    });

});

// function readURL(input) {
//     if (input.files && input.files[0]) {
//         var reader = new FileReader();
//         reader.onload = function(e) {
//             $('.imgCircle')
//                 .attr('src', e.target.result)
//                 .width(200)
//                 .height(200)
//         };
//         reader.readAsDataURL(input.files[0]);
//     }
// }

let getFileExtension = filename => {
    var extension = filename.replace(/^.*\./, "");
    if (extension == filename) {
        extension = "";
    } else {
        extension = extension.toLowerCase().trim();
    }

    return extension;
};