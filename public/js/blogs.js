$(function() {
    //$("#accordion").accordion();

    // $("#accordion").accordion({
    //     activate: function(event, ui) {
    //         alert("after activate : " + ui.newHeader.text()); // For instance.
    //     }
    // });

    // $("#accordion").accordion({
    //     beforeActivate: function(event, ui) {
    //         alert("beforeActivate " + ui.newHeader.text());
    //     }
    // });


    var icons = {
        header: "ui-icon-circle-arrow-e",
        activeHeader: "ui-icon-circle-arrow-s"
    };

    $('#accordion').accordion({
        heightStyle: 'content',
        collapsible: true,
        icons: icons,
        header: "> div > h3"
    }).sortable({
        axis: "y",
        handle: "h3",
        stop: function(event, ui) {
            // IE doesn't register the blur when sorting
            // so trigger focusout handlers to remove .ui-state-focus
            ui.item.children("h3").triggerHandler("focusout");

            // Refresh accordion to handle new order
            $(this).accordion("refresh");
        }
    });

    // $('span.ui-icon-lightbulb').click(function(e) {
    //     alert('Lightbulb');
    //     e.preventDefault();
    //     e.stopPropagation();
    // });

    $('.edit').click(function(e) {
        alert('glyphicon glyphicon-edit');
        e.preventDefault();
        e.stopPropagation();
    });

    $("#addblog").click("on", function() {
        $('.addeditblog').removeClass("hidden");
        $('#canceladdblog').removeClass("hidden");
        $('#addblog').addClass("hidden");
    });

    $("#canceladdblog").click("on", function() {
        $('.addeditblog').addClass("hidden");
        $('#addblog').removeClass("hidden");
        $('#canceladdblog').addClass("hidden");
    });
});