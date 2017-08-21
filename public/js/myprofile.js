'use strict';
$(function() {
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
        console.log("hi " + $("#checkeraboutme").is(':checked'));
        if ($("#checkeraboutme").is(':checked')) {
            $(".Successpanel").addClass("hidden");
            $(".ErrorPanel").addClass("hidden");
            $(".saveaboutmeinfo").removeClass("hidden");
        } else {
            $(".saveaboutmeinfo").addClass("hidden");
        }
    });

    $(".hideuploadform").on("click", () => {
        $("#displayImage").val("");
        $(".Successpanel").addClass("hidden");
        $(".uploadprofilephoto").attr("style", "display:none;");
        $("#checker").attr("checked", false);
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