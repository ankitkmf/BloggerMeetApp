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
        if ($("#checkerpersonalinfo").is(':checked')) {
            $(".pderrorPanel").addClass("hidden");
            $(".pdsuccessResult").addClass("hidden");
            $(".pderrorResult").addClass("hidden");
            $(".savepersonalinfo").removeClass("hidden");
        } else {
            $(".savepersonalinfo").addClass("hidden");
        }
    });

    // Edit 'proffessional details'
    $("#checkerprofinfo").on("click", () => {
        if ($("#checkerprofinfo").is(':checked')) {
            $(".proferrorPanel").addClass("hidden");
            $(".profsuccessResult").addClass("hidden");
            $(".proferrorResult").addClass("hidden");
            $(".saveprofinfo").removeClass("hidden");
        } else {
            $(".saveprofinfo").addClass("hidden");
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
        $(".saveaboutmeinfo").removeClass("hidden");
    });

    $("#frmaboutme .hidefrmaboutme").on("click", () => {
        $(".saveaboutmeinfo").addClass("hidden");
        $("#checkeraboutme").attr("checked", false);
    });

    $("#frmpersonaldetails .hidefrmpersonaldetails").on("click", () => {
        $(".savepersonalinfo").addClass("hidden");
        $("#checkerpersonalinfo").attr("checked", false);
    });

    $("#frmpersonaldetails .clearmsg").on("focus", () => {
        $(".pderrorPanel").html("");
        $(".pdsuccessResult").addClass("hidden");
        $(".pderrorResult").addClass("hidden");
        $(".savepersonalinfo").removeClass("hidden");
    });

    $("#frmprofdetails .hidefrmprofdetails").on("click", () => {
        $(".saveprofinfo").addClass("hidden");
        $("#checkerprofinfo").attr("checked", false);
    });

    $("#frmprofdetails .clearmsg").on("focus", () => {
        $(".proferrorPanel").html("");
        $(".profsuccessResult").addClass("hidden");
        $(".proferrorResult").addClass("hidden");
        $(".saveprofinfo").removeClass("hidden");
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
            run_waitMe("aboutmestatus");
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
                    stop_waitMe("aboutmestatus");
                },
                error: function(error) {
                    console.log("error : " + error);
                    $(".amsuccessResult").addClass("hidden");
                    $(".amerrorResult").removeClass("hidden");
                    stop_waitMe("aboutmestatus");
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
        //var regex = /^[a-zA-Z ]+$/;

        var firstname = $("#inputfirstname").val();
        var lastname = $("#inputlastname").val();
        var phone = $("#inputphone").val();
        var pinno = $("#inputpinno").val();

        if (firstname == "" || firstname == undefined) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add your First Name.")
            );
        } else if (!validateName(firstname)) {
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
        } else if (!validateName(lastname)) {
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

        if (pinno != "" && !($.isNumeric(pinno))) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Only digit for PIN number.")
            );
        }

        var data = new FormData(this); // <-- 'this' is your form element

        if (isValid) {
            run_waitMe("personaldetailstatus");
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
                    $(".savepersonalinfo").addClass("hidden");
                    //$(".profileprogress").imgProgressTo(profileCompleteStatus());
                    stop_waitMe("personaldetailstatus");
                },
                error: function(error) {
                    console.log("error : " + error);
                    $(".pdsuccessResult").addClass("hidden");
                    $(".pderrorResult").removeClass("hidden");
                    stop_waitMe("personaldetailstatus");
                }
            });
        } else {
            $(".pderrorPanel").html(errorPanel).removeClass("hidden");
        }
    });

    /* Code to update proffessional details in the my profile page */
    $("#frmprofdetails").submit(function(e) {
        e.preventDefault();

        var isValid = true;
        var errorPanel = $("<div></div>");
        var errorMessage = null;
        var regex = /^[a-zA-Z ]+$/;

        var proffession = $("#inputproffession").val();
        var experience = $("#inputexperience").val();
        var eduyear = $("#inputeduyear").val();
        var compemail = $("#inputcompemail").val();
        var compphone = $("#inputcompphone").val();

        if (proffession == "" || proffession == undefined) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add your proffession.")
            );
        }

        if (experience != "" && !($.isNumeric(experience))) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Only digit for year of experience.")
            );
        }

        if (eduyear != "" && !($.isNumeric(eduyear))) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Only digit for year of highest qualification.")
            );
        }

        if (compemail != "" && !(validateEmail(compemail))) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add a valid emailid.")
            );
        }

        if (compphone != "" && !($.isNumeric(compphone))) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Only digit for company phone number.")
            );
        }

        var data = new FormData(this); // <-- 'this' is your form element

        if (isValid) {
            run_waitMe("proffessionaldetailstatus");
            $(".proferrorPanel").html("");
            $.ajax({
                url: "/myprofile/updateprofdetails",
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: "POST",
                success: function(data) {
                    console.log("success : " + JSON.stringify(data));
                    $(".proferrorResult").addClass("hidden");
                    $(".profsuccessResult").removeClass("hidden");
                    $(".savepersonalinfo").addClass("hidden");
                    //$(".profileprogress").imgProgressTo(profileCompleteStatus());
                    stop_waitMe("proffessionaldetailstatus");
                },
                error: function(error) {
                    console.log("error : " + error);
                    $(".profsuccessResult").addClass("hidden");
                    $(".proferrorResult").removeClass("hidden");
                    stop_waitMe("proffessionaldetailstatus");
                }
            });
        } else {
            $(".proferrorPanel").html(errorPanel).removeClass("hidden");
        }
    });

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