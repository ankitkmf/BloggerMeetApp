'use strict';
$(function() {

    var lastbloghistoryid = "0";

    // var bloghistoryid = $('#divImageBlogHistory').data("lastbloghistoryid");
    // if (bloghistoryid == "0") $('#divImageBlogHistory').addClass("hidden");

    $("#inputDOB").datepicker();

    $(".profileprogress").imgProgress({
        // path to the image
        // path to the image
        //img_url: "sss.jpg",
        // size in pixels
        size: 200,
        // bar size
        barSize: 12,
        // background color
        backgroundColor: "white",
        // foreground color
        foregroundColor: "#4abde8",
        // CSS background-size property
        backgroundSize: "cover",
        // current percentage value
        percent: 5
    });

    $(".profileprogress").imgProgressTo(profileCompleteStatus());

    // var icons = {
    //     header: "ui-icon-circle-arrow-e",
    //     activeHeader: "ui-icon-circle-arrow-s"
    // };

    // $('#accordion').accordion({
    //     heightStyle: 'content',
    //     collapsible: true,
    //     //icons: icons,
    //     header: "> div > h3"
    // }).sortable({
    //     axis: "y",
    //     handle: "h3",
    //     stop: function(event, ui) {
    //         // IE doesn't register the blur when sorting
    //         // so trigger focusout handlers to remove .ui-state-focus
    //         ui.item.children("h3").triggerHandler("focusout");

    //         // Refresh accordion to handle new order
    //         $(this).accordion("refresh");
    //     }
    // });

    // Edit profile photo
    $("#checker").on("click", () => {
        if ($("#checker").is(':checked')) {
            $(".Successpanel").addClass("hidden");
            $(".uploadprofilephoto").attr("style", "display:block");
            $(".editphoto").addClass("hidden");
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
            $(".editaboutme").addClass("hidden");
            $(".dataaboutme").addClass("hidden");
            $(".frmaboutme").removeClass("hidden");
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
            $(".editpersonalinfo").addClass("hidden");
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
            $(".editproffdetails").addClass("hidden");
        } else {
            $(".saveprofinfo").addClass("hidden");
        }
    });

    $(".hideuploadform").on("click", () => {
        $("#displayImage").val("");
        $(".Successpanel").addClass("hidden");
        $(".uploadprofilephoto").attr("style", "display:none;");
        $("#checker").attr("checked", false);
        $(".editphoto").removeClass("hidden");
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
        $(".editaboutme").removeClass("hidden");
        $(".dataaboutme").removeClass("hidden");
        $(".frmaboutme").addClass("hidden");
    });

    $("#frmpersonaldetails .hidefrmpersonaldetails").on("click", () => {
        $(".savepersonalinfo").addClass("hidden");
        $("#checkerpersonalinfo").attr("checked", false);
        $(".editpersonalinfo").removeClass("hidden");
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
        $(".editproffdetails").removeClass("hidden");
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
                        $(".profileprogress").imgProgressTo(profileCompleteStatus());
                        $(".editphoto").removeClass("hidden");
                        stop_waitMe("uploadphotostatus");

                        hidesuccessmessage("Successpanel");
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
                    $(".profileprogress").imgProgressTo(profileCompleteStatus());
                    $(".editaboutme").removeClass("hidden");
                    $(".dataaboutme").removeClass("hidden");
                    $(".frmaboutme").addClass("hidden");
                    $(".dataaboutme").html(content);
                    $("#aboutme").val(content);
                    stop_waitMe("aboutmestatus");

                    hidesuccessmessage("amsuccessResult");
                },
                error: function(error) {
                    console.log("error : " + error);
                    $(".amsuccessResult").addClass("hidden");
                    $(".amerrorResult").removeClass("hidden");
                    //$(".editaboutme").addClass("hidden");
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
                    $(".profileprogress").imgProgressTo(profileCompleteStatus());
                    $(".editpersonalinfo").removeClass("hidden");
                    stop_waitMe("personaldetailstatus");

                    hidesuccessmessage("pdsuccessResult");
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
                    $(".profileprogress").imgProgressTo(profileCompleteStatus());
                    $(".editproffdetails").removeClass("hidden");
                    stop_waitMe("proffessionaldetailstatus");

                    hidesuccessmessage("profsuccessResult");
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

    $(".blogactivitytab").on("click", function(e) {
        e.preventDefault();
        console.log("clicked");
        run_waitMe("bloglistbyuserid");

        var userid = $("#userid").val();

        GetBlogListByUserid(userid);

        stop_waitMe("bloglistbyuserid");
    });

    $(".commentactivitytab").on("click", function(e) {
        e.preventDefault();
        console.log("clicked");
        run_waitMe("bloglistbyuseridcmnt");

        var userid = $("#userid").val();

        GetBlogListByUseridCmnt(userid);

        stop_waitMe("bloglistbyuseridcmnt");
    });

    // $('#divImageBlogHistory').on("click", function() {
    //     run_waitMe("bloghistorybyuserid");

    //     lastbloghistoryid = $(this).data("lastbloghistoryid");

    //     var userid = "";
    //     if ($('#userid').val() != undefined)
    //         userid = $('#userid').val();

    //     console.log(lastbloghistoryid + " , " + userid);

    //     LoadBlogHistory(userid, lastbloghistoryid, "");

    //     stop_waitMe("bloghistorybyuserid");
    // });

    $("#BlogHistorySearchBtn").on("click", () => {

        var userid = "";
        if ($('#userid').val() != undefined)
            userid = $('#userid').val();

        var selectedBlogID = "";
        if ($('#selectedBlogID').val() != undefined)
            selectedBlogID = $('#selectedBlogID').val();

        console.log(userid + "," + selectedBlogID);

        if (selectedBlogID != "") {
            $(".nobloghistoryonprofile").addClass("hidden");
            LoadBlogHistory(userid, selectedBlogID);
        } else {
            $(".bloghistorybyuserid").html("");
            $(".nobloghistoryonprofile").removeClass("hidden");
        }
    });

    $("#CommentHistorySearchBtn").on("click", () => {

        var selectedBlogIDCmnt = "";
        if ($('#selectedBlogIDCmnt').val() != undefined)
            selectedBlogIDCmnt = $('#selectedBlogIDCmnt').val();

        console.log(selectedBlogIDCmnt);

        if (selectedBlogIDCmnt != "") {
            $(".nocommenthistoryonprofile").addClass("hidden");
            LoadCommentHistory(selectedBlogIDCmnt);
        } else {
            $(".commenthistorybyblogid").html("");
            $(".nocommenthistoryonprofile").removeClass("hidden");
        }
    });

    $(".commenthistorybyblogid").on("click", "span>button", function() {
        console.log("click");
        console.log("Click :" + $(this).closest(".commenttable").data("id"));
        console.log($(this).parent("span").find($("input[type='radio']:checked")).data("type"));
        console.log("click");
        var data = {
            _id: $(this).closest(".commenttable").data("id"),
            status: $(this).parent("span").find($("input[type='radio']:checked")).data("type")
        };
        if (data._id != null && data.status != null) {
            swal({
                title: "Are you sure?",
                text: "Are you sure that you want to update this records?",
                type: "warning",
                showCancelButton: true,
                closeOnConfirm: false,
                confirmButtonText: "Yes, update it!",
                confirmButtonColor: "#ec6c62"
            }, function() {
                $.ajax({
                        method: "Post",
                        url: "/myprofile/updatecomment",
                        data: data
                    })
                    .done(function(result) {
                        // var selectedBlogIDCmnt = "";
                        // if ($('#selectedBlogIDCmnt').val() != undefined)
                        //     selectedBlogIDCmnt = $('#selectedBlogIDCmnt').val();

                        swal("Updated! Comment is successfully updated!", "Success");
                    })
                    .error(function(data) {
                        swal("Oops", "We couldn't connect to the server!", "Error");
                    });
            });
        }
    });

    /* Code toverify email id in the my profile page */
    $("#frmemailverification").submit(function(e) {
        e.preventDefault();
        run_waitMe("divverifyemail");

        var data = new FormData(this); // <-- 'this' is your form element

        $.ajax({
            url: "/verifyemail/triggeremail",
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            type: "POST",
            success: function(data) {
                console.log("success : " + JSON.stringify(data));
                $(".vemailsuccessResult").removeClass("hidden");
                $(".vemailerrorResult").addClass("hidden");
                $(".emailverificationform").addClass("hidden");
                $(".profileprogress").imgProgressTo(profileCompleteStatus());
                stop_waitMe("divverifyemail");
            },
            error: function(error) {
                console.log("error : " + error);
                $(".vemailsuccessResult").addClass("hidden");
                $(".vemailerrorResult").removeClass("hidden");
                stop_waitMe("divverifyemail");
            }
        });

    });
});

let LoadBlogHistory = (userid, selectedBlogID) => {
    run_waitMe("bloghistorybyuserid");
    $.when(GetCompiledTemplate("bloghistory"), GetBlogHistoryByBlogID(userid, selectedBlogID))
        .done(function(template, json) {

            var data = { "bloghistory": json, "selectedBlogID": selectedBlogID };
            var compiledTemplate = Handlebars.compile(template);
            var newhtml = compiledTemplate(data);

            $(".bloghistorybyuserid").html("");
            $(".bloghistorybyuserid").html(newhtml);
        });
    stop_waitMe("bloghistorybyuserid");
};

let GetBlogHistoryByBlogID = (userid, selectedBlogID) => {
    //console.log("GetBlogsBySIandUserID : startindex : " + startindex + ", userid : " + userid);
    var d = $.Deferred();

    $.ajax({
            method: "get",
            url: "/viewblog/GetBlogHistoryByBlogID/" + userid + "/" + selectedBlogID
        })
        .done(function(jsonResult) {
            d.resolve(jsonResult);
        })
        .fail(function() {
            d.reject;
        })
        .always(function() {});
    return d.promise();
};

let LoadCommentHistory = (selectedBlogID) => {
    run_waitMe("commenthistorybyblogid");
    $.when(GetCompiledTemplate("commenthistory"), GetCommentsByBlogID(selectedBlogID))
        .done(function(template, json) {

            var data = { "commenthistory": json, "selectedBlogID": selectedBlogID };
            var compiledTemplate = Handlebars.compile(template);
            var newhtml = compiledTemplate(data);
            $(".commenthistorybyblogid").html("");
            $(".commenthistorybyblogid").html(newhtml);

            // $('#accordion').accordion({
            //     heightStyle: 'content',
            //     collapsible: true,
            //     //icons: icons,
            //     header: "> div > h3"
            // }).sortable({
            //     axis: "y",
            //     handle: "h3",
            //     stop: function(event, ui) {
            //         // IE doesn't register the blur when sorting
            //         // so trigger focusout handlers to remove .ui-state-focus
            //         ui.item.children("h3").triggerHandler("focusout");

            //         // Refresh accordion to handle new order
            //         $(this).accordion("refresh");
            //     }
            // });
        });
    stop_waitMe("commenthistorybyblogid");
};

let GetCommentsByBlogID = (selectedBlogID) => {
    //console.log("GetBlogsBySIandUserID : startindex : " + startindex + ", userid : " + userid);
    var d = $.Deferred();

    $.ajax({
            method: "get",
            url: "/viewblog/GetCommentByBlogID/" + selectedBlogID
        })
        .done(function(jsonResult) {
            d.resolve(jsonResult);
        })
        .fail(function() {
            d.reject;
        })
        .always(function() {});
    return d.promise();
};


// let LoadBlogList = (userid) => {
//     run_waitMe("bloglistbyuserid");
//     $.when(GetCompiledTemplate("bloglist"), GetBlogListByUserid(userid))
//         .done(function(template, json) {

//             var data = { "bloglist": json };
//             var compiledTemplate = Handlebars.compile(template);
//             var newhtml = compiledTemplate(data);

//             $(".bloglistbyuserid").html("");
//             $(".bloglistbyuserid").html(newhtml);

//             console.log(JSON.stringify(data));

//             if (json.count > 0) {
//                 $(".nobloghistory").addClass("hidden");
//             } else {
//                 $(".nobloghistory").removeClass("hidden");
//             }
//         });
//     stop_waitMe("bloglistbyuserid");
// };

// let GetBlogListByUserid = (userid) => {
//     //console.log("GetBlogsBySIandUserID : startindex : " + startindex + ", userid : " + userid);
//     var d = $.Deferred();

//     $.ajax({
//             method: "get",
//             url: "/viewblog/GetBlogListByUserid/" + userid
//         })
//         .done(function(jsonResult) {
//             d.resolve(jsonResult);
//         })
//         .fail(function() {
//             d.reject;
//         })
//         .always(function() {});
//     return d.promise();
// };

// let LoadBlogHistory = (userid, lastbloghistoryid, state) => {
//     run_waitMe("bloghistorybyuserid");
//     $.when(GetCompiledTemplate("bloghistory"), GetBlogHistoryuserid(userid, lastbloghistoryid))
//         .done(function(template, json) {

//             var data = { "bloghistory": json };
//             var compiledTemplate = Handlebars.compile(template);
//             var newhtml = compiledTemplate(data);

//             if (state != "") {
//                 var icons = {
//                     header: "ui-icon-circle-arrow-e",
//                     activeHeader: "ui-icon-circle-arrow-s"
//                 };

//                 $('#accordion').accordion({
//                     heightStyle: 'content',
//                     collapsible: true,
//                     icons: icons,
//                     header: "> div > h3"
//                 }).sortable({
//                     axis: "y",
//                     handle: "h3",
//                     stop: function(event, ui) {
//                         // IE doesn't register the blur when sorting
//                         // so trigger focusout handlers to remove .ui-state-focus
//                         ui.item.children("h3").triggerHandler("focusout");

//                         // Refresh accordion to handle new order
//                         $(this).accordion("refresh");
//                     }
//                 });
//             }

//             if (json.count > 0) {
//                 if (lastbloghistoryid == "0")
//                     $("#accordion").html(newhtml);
//                 else
//                     $("#accordion").append(newhtml);

//                 $("#accordion").accordion("refresh");

//                 lastbloghistoryid = json.lastbloghistoryid;

//                 if (json.count < 10)
//                     $("#divImageBlogHistory").addClass("hidden");
//                 else
//                     $("#divImageBlogHistory").removeClass("hidden");

//                 $("#divImageBlogHistory").removeData("lastbloghistoryid");
//                 $("#divImageBlogHistory").data("lastbloghistoryid", lastbloghistoryid);
//                 $(".nobloghistory").addClass("hidden");
//             } else {
//                 $(".nobloghistory").removeClass("hidden");
//             }
//         });
//     stop_waitMe("bloghistorybyuserid");
// };

// let GetBlogHistoryuserid = (userid, lastbloghistoryid) => {
//     //console.log("GetBlogsBySIandUserID : startindex : " + startindex + ", userid : " + userid);
//     var d = $.Deferred();

//     $.ajax({
//             method: "get",
//             url: "/viewblog/GetBlogHistoryuserid/" + userid + "/" + lastbloghistoryid
//                 //data: { "si": startindex, "userid": userid }
//         })
//         .done(function(jsonResult) {
//             d.resolve(jsonResult);
//         })
//         .fail(function() {
//             d.reject;
//         })
//         .always(function() {});
//     return d.promise();
// };

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

let GetBlogListByUserid = (userid) => {
    $.ajax({
            method: "Get",
            url: "/viewblog/GetBlogListByUserid/" + userid
        })
        .done(function(data) {
            if (data != null) {
                var bloglist = [];
                $.each(data.result, function(key, value) {
                    var list = {};
                    list.label = value.topic;
                    list.value = value._id;
                    bloglist.push(list);
                });
                blogListAutoSuggest(bloglist);
            }
        })
        .fail(function(err) {})
        .always(function() {
            stop_waitMe("bloglistbyuserid");
        });
};

let blogListAutoSuggest = (data) => {
    // console.log("Users:" + JSON.stringify(data));
    $("#inputSearch").autocomplete({
            minLength: 1,
            source: data,
            //autoFocus: true,
            focus: function(event, ui) {
                $("#inputSearch").val(ui.item.label);
                return false;
            },
            // close: function(event, ui) {
            //     if (!$("ul.ui-autocomplete").is(":visible")) {
            //         $("ul.ui-autocomplete").show();
            //     }
            // },
            select: function(event, ui) {
                var value = ui.item.label; //+ " ( " + ui.item.authType + " ) ";
                $("#inputSearch").val(value);
                $("#selectedBlogID").val(ui.item.value);
                return false;
            },
            change: function(event, ui) {
                var value = $(this).val();
                $("#inputSearch").val(value);
                $("#selectedBlogID").val("");
                var returnedData = $.grep(data, function(element, index) {
                    if (value.toLowerCase() == element.label.toLowerCase()) {
                        console.log("Blog id " + element.value);
                        $("#selectedBlogID").val(element.value);
                    }
                });
                return false;
            }
        })
        .autocomplete("instance")._renderItem = function(ul, item) {
            return $("<li>")
                .append("<div class='list-group list-group-item'>" + item.label + "</div>").appendTo(ul);
        };
};

let GetBlogListByUseridCmnt = (userid) => {
    $.ajax({
            method: "Get",
            url: "/viewblog/GetBlogListByUserid/" + userid
        })
        .done(function(data) {
            if (data != null) {
                var bloglist = [];
                $.each(data.result, function(key, value) {
                    var list = {};
                    list.label = value.topic;
                    list.value = value._id;
                    bloglist.push(list);
                });
                blogListAutoSuggestCmnt(bloglist);
            }
        })
        .fail(function(err) {})
        .always(function() {
            stop_waitMe("bloglistbyuseridcmnt");
        });
};

let blogListAutoSuggestCmnt = (data) => {
    // console.log("Users:" + JSON.stringify(data));
    $("#inputSearchcmnt").autocomplete({
            minLength: 1,
            source: data,
            //autoFocus: true,
            focus: function(event, ui) {
                $("#inputSearchcmnt").val(ui.item.label);
                return false;
            },
            // close: function(event, ui) {
            //     if (!$("ul.ui-autocomplete").is(":visible")) {
            //         $("ul.ui-autocomplete").show();
            //     }
            // },
            select: function(event, ui) {
                var value = ui.item.label; //+ " ( " + ui.item.authType + " ) ";
                $("#inputSearchcmnt").val(value);
                $("#selectedBlogIDCmnt").val(ui.item.value);
                return false;
            },
            change: function(event, ui) {
                var value = $(this).val();
                $("#inputSearchcmnt").val(value);
                $("#selectedBlogIDCmnt").val("");
                var returnedData = $.grep(data, function(element, index) {
                    if (value.toLowerCase() == element.label.toLowerCase()) {
                        console.log("Blog id " + element.value);
                        $("#selectedBlogIDCmnt").val(element.value);
                    }
                });
                return false;
            }
        })
        .autocomplete("instance")._renderItem = function(ul, item) {
            return $("<li>")
                .append("<div class='list-group list-group-item'>" + item.label + "</div>").appendTo(ul);
        };
};

let profileCompleteStatus = () => {
    var totalFields = 20;
    var percentagePerFields = 100 / totalFields;

    var i = 1;
    i = checkControlContent("_id", i, true);
    i = checkControlContent("aboutme", i, false);
    i = checkControlContent("inputfirstname", i, false);
    i = checkControlContent("inputlastname", i, false);
    i = checkControlContent("inputDOB", i, false);
    i = checkControlContent("inputaddress1", i, false);
    i = checkControlContent("inputaddress2", i, false);
    i = checkControlContent("inputcountry", i, false);
    i = checkControlContent("inputpinno", i, false);
    i = checkControlContent("inputphone", i, false);
    i = checkControlContent("inputproffession", i, false);
    i = checkControlContent("inputexperience", i, false);
    i = checkControlContent("inputdepartment", i, false);
    i = checkControlContent("inputcompanyname", i, false);
    i = checkControlContent("inputcompemail", i, false);
    i = checkControlContent("inputcompphone", i, false);
    i = checkControlContent("inputqualification", i, false);
    i = checkControlContent("inputeduyear", i, false);
    i = checkControlContent("inputlocation", i, false);
    i = checkControlContent("hndemailverified", i, false);

    var totalpercentage = percentagePerFields * i;

    $(".profileCompleted").html("");
    $(".profileCompleted").append(
        "<strong>" + totalpercentage + "% Completed</strong>"
    );

    var w = totalpercentage + "%";
    $('.progress-bar').attr('aria-valuenow', totalpercentage).css('width', w);

    return totalpercentage;
};

let checkControlContent = (control_id, i, isImage) => {
    var ctrlVal = $("#" + control_id).val();

    if (isImage && ctrlVal !== "" && ctrlVal !== undefined) {
        var imgPath = ("/" + ctrlVal + "/" + ctrlVal + ".jpg").toLowerCase();
        var imgSRC = $(".reloadimage").attr("src").toLowerCase();


        if (imgSRC.indexOf('?') != -1)
            imgSRC = imgSRC.substring(0, imgSRC.indexOf('?'));

        if (imgPath == imgSRC)
            return i + 1;
        else
            return i;

    } else if (ctrlVal !== "" && ctrlVal !== undefined) return i + 1;
    else return i;
};

function hidesuccessmessage(divID) {
    setTimeout(function() {
        $('.' + divID).addClass("hidden");
    }, 5000);
}