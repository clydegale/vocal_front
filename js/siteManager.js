/*
    This File handles page transitions and a few helper or dirty functions (since there was no more time for refactoring.

    Page transition is done asynchronically via a template system and ajax calls.
    Page transition is handled by the loadView() function. loadView is registered as an onclick listener on all "links" within the pages
    depending on the view parameter specified the specific function will be loaded since there are a few things that cant be handled genericly.

    Most of the functionality of this webapp is done serverside and is provided via webservices. These services are
    called via ajax calls like this:

     $.securityCrucialAjaxPOST({
             url : managerProperties.services.EDIT_USER_URL,
             dataType : 'json',
             type : 'POST',
             async : true,
             data : form.serialize()
     }).success(function(errorDTO) {
            securityCrucialErrorHandler(errorDTO, _handleUserEditErrors)
     }).fail(function() {
            console.log("userCreate Query Failed")
     });

     Most of the Helper.js files are focused around using these calls and handling their errors/successes
 */

"use strict";

// loadView functions
// ---------------------------------------------------------------------------------------------------------------------

function loadView(view, afterLoadViewCallback, beforeViewCallback) {
    beforeViewChange(beforeViewCallback);
    $.ajax({
        url : managerProperties.dirs.TEMPLATE_UI + view + ".html",
        dataType : 'html',
        type : 'GET',
        async : true
        //cache: true,
    }).done(function(data, textStatus, jqXHR) {
            handleLoadView(data, textStatus, jqXHR, view, afterLoadViewCallback)
    }).fail(function() {
            console.log("Error with AJAX Query: " + view);
    });
}

function handleLoadView(data, textStatus, jqXHR, view, afterLoadViewCallback) {
    switch (view) {
        case managerProperties.siteStates.LOGIN_SCREEN:
            loadLoginScreen(data);
            break;
        case managerProperties.siteStates.ACCOUNT_CREATION:
            loadAccountCreation(data);
            break;
        case managerProperties.siteStates.OVERVIEW:
            loadOverview(data);
            break;
        case managerProperties.siteStates.CALENDAR:
            loadCalendar(data);
            break;
        case managerProperties.siteStates.USER_SETTINGS:
            loadUserSettings(data);
            break;
        case managerProperties.siteStates.CREATE_EVENT:
            loadCreateEvent(data);
            break;
        default:
            loadLoginScreen(data);

    }
    if(typeof afterLoadViewCallback === 'function') {
        afterLoadViewCallback();
    }
}

function beforeViewChange(beforeViewCallback) {
    if(typeof beforeViewCallback === 'function') {
        beforeViewCallback();
    }
    // parameter for closeAlert() needs to be the small x button
    // $('.alert') should safely work since there is always only one .alert node present
    closeAlert($('.alert').children("button"));
}
/*
 * The following functions will load the specific view using AJAX requests to the templates in tmpls/ui/
 */
function loadLoginScreen(html) {
    $('#contentMain').html(html);

    //Setting topbar buttons accordingly
    $('#navbar-content').addClass("invisible");

    $.getScript(managerProperties.dirs.JS + "loginHelper.js");

    //Update the current pageState
    _updateCurrentSiteState(managerProperties.siteStates.LOGIN_SCREEN)

}

function loadAccountCreation(html) {
    $('#contentMain').html(html);

    //Setting topbar buttons accordingly
    $('#navbar-content').addClass("invisible");

    $.getScript(managerProperties.dirs.JS + "accountCreationHelper.js");

    //Update the current pageState
    _updateCurrentSiteState(managerProperties.siteStates.ACCOUNT_CREATION);
}


function loadOverview(rawHTML) {
    // Throws User back to loginPage if no session is found == not logged in
    if(sessionStorage.getItem(managerProperties.userSessionStorageObject.SESSION_ID) == null) {
        loadView(managerProperties.siteStates.LOGIN_SCREEN);
        return;
    }

    if((sessionStorage.getItem(managerProperties.userSessionStorageObject.ROLE) == "ADMIN"
    ||  sessionStorage.getItem(managerProperties.userSessionStorageObject.ROLE) == "MANAGER")
    &&  $('#navbar-buttons').children('#navbar-eventedit').size() == 0) {

//      has to be escaped because of the different usages of " and '
//      var appendHTML = '<li id="navbar-eventedit"><a href="javascript:void(0)" onclick="loadView('createEvent')">Event erstellen</a></li>';
        var appendHTML = "\x3Cli id=\"navbar-eventedit\"\x3E\x3Ca href=\"javascript:void(0)\" onclick=\"loadView(\'createEvent\')\"\x3EEvent erstellen\x3C\x2Fa\x3E\x3C\x2Fli\x3E";
        $('#navbar-calendar').after(appendHTML)
    }

    /* Reads the raw template of the Overview and proccesses it through the _ template function (used to dynamically
        show more settings to users with more privileges
     */
    var rawHTMLTmpl = _.template(rawHTML);
    var processdHTML = rawHTMLTmpl({userRole: sessionStorage.getItem(managerProperties.userSessionStorageObject.ROLE)});
    $('#contentMain').html(processdHTML);

    // Unhide toolbar buttons
    $('#navbar-content').removeClass("invisible");
    $('#navbar-username').html(sessionStorage.getItem("firstName") + " " + sessionStorage.getItem("lastName"));
    //Setting topbar buttons accordingly
    _setNavbarButtons(managerProperties.navbarButtons.OVERVIEW);

    //Update the current pageState
    _updateCurrentSiteState(managerProperties.siteStates.OVERVIEW);

}

function loadCalendar(html) {
    $('#contentMain').html(html);
    // Unhide toolbar buttons
    $('#navbar-content').removeClass("invisible");
    _setNavbarButtons(managerProperties.navbarButtons.CALENDAR);

    $.getScript(managerProperties.dirs.JS + "calendar.js", function() {
        // Calling the app.js file after calendar.js has been fully loaded to prevent a race condition
        $.getScript(managerProperties.dirs.JS + "app.js");
    });
    $.getScript(managerProperties.dirs.JS + "language/de-DE.js");


    //Update the current pageState
    _updateCurrentSiteState(managerProperties.siteStates.CALENDAR)
}

function loadUserSettings(html) {
    $('#contentMain').html(html);
    // Unhide toolbar buttons
    $('#navbar-content').removeClass("invisible");
    _setNavbarButtons(managerProperties.navbarButtons.SETTINGS);

    $.getScript(managerProperties.dirs.JS + "userSettingsHelper.js", function(data, textStatus, jqxhr) {
        //populateAccountEditForm()
    });

    //Update the current pageState
    _updateCurrentSiteState(managerProperties.siteStates.USER_SETTINGS)

}

function loadCreateEvent(html) {
    $('#contentMain').html(html);
    // Unhide toolbar buttons
    $('#navbar-content').removeClass("invisible");
    _setNavbarButtons(managerProperties.navbarButtons.CREATE_EVENT);

    $.getScript(managerProperties.dirs.JS + "createEventHelper.js")

    //Update the current pageState
    _updateCurrentSiteState(managerProperties.siteStates.USER_SETTINGS)
}
// End of loadView functions
// ---------------------------------------------------------------------------------------------------------------------

// checks if the HTML5 sessionStorage object is available. It is crucial for the session handling since we're not using cookies
function isStorageDefined() {
    return !((typeof Storage === "undefined") || (typeof window.sessionStorage === "undefined"));
}

function _updateCurrentSiteState(currentSiteState) {
    sessionStorage.setItem("currentSiteState", currentSiteState);
}

// Internal function to toggle the different Buttons in the header bar
function _setNavbarButtons(buttonName) {
    var buttons = $('#navbar-buttons').children();
    buttons.each(function() {
        var button = $(this);
        button.removeClass();
        if(button.attr('id') == buttonName) {
            button.addClass("active");
        }
    })
}

// Clears the storage, notifies the server and fixes a small bug
function logoutUser() {
    $.securityCrucialAjaxPOST({
        url : managerProperties.services.LOGOUT_USER_URL,
        dataType : 'json',
        type : 'POST',
        async : true
    }).done(function(data) {

    }).fail(function() {
        console.log("userlogout Query Failed")
    });
    sessionStorage.clear();
    $('#navbar-eventedit').remove();
    loadView(managerProperties.siteStates.LOGIN_SCREEN);
}

// Alert functions (small red/green popdown that are shown on errors or successes)
// ---------------------------------------------------------------------------------------------------------------------
function showAlert(alertType, message) {
    if(message == null || message == '') {
        return;
    }
    var alertArea = $('#alertArea');
    var textArea = $('#alertAreaText');
    alertArea.slideUp(managerProperties.SLIDE_DURATION);

    setTimeout(function() {
        _resetAlertType(alertArea);

        alertArea.addClass(alertType);
        textArea.html(message);
        alertArea.slideDown(managerProperties.SLIDE_DURATION);
        window.scrollTo(0,0)
    }, managerProperties.SLIDE_DURATION);
}

function closeAlert(button) {
    var alertArea = $(button).parent(".alert");
    alertArea.slideUp(managerProperties.SLIDE_DURATION);
    // Need to set Timeout so the colors wont change while the slide animation is still going
    setTimeout(function() {
        _resetAlertType(alertArea);
    }, managerProperties.SLIDE_DURATION);
}

function _resetAlertType(alertArea) {
    alertArea.removeClass(managerProperties.alertTypes.DANGER);
    alertArea.removeClass(managerProperties.alertTypes.SUCCESS);
    alertArea.removeClass(managerProperties.alertTypes.WARNING);
    alertArea.removeClass(managerProperties.alertTypes.INFO);
}
// End of alert functions
// ---------------------------------------------------------------------------------------------------------------------


// Helper function to fill the <select> tag with the locations
function _generateLocationSelector(locationsDTO) {
    // Using attribute selector instead of id so i wont have to differentiate between the accountCreationForm and the userEditForm
    var select = $('select[name=schoollocation]');

    // Put Object of Objects into an Array of Objects (for Sorting)
    var sortable = [];
    for (var object in locationsDTO) {
        // may or may not be a hack
        if(locationsDTO[object] == null) {
            continue
        }
        sortable.push({
            'key': object,
            'value': locationsDTO[object]
        });
    }

    // Sort the Array of Objects by the Objects values
    sortable.sort(function(a, b) {
        return a.value.toLowerCase() > b.value.toLowerCase();
    });

    // Create a <option> Element for each Object in the Array and add it to the Select Element
    for (var key in sortable) {
        var option = document.createElement("option");
        option.textContent = sortable[key].value;
        option.value = sortable[key].key;
        $(select).append(option)
    }
}

function resetForm(formID) {
    $('#' + formID)[0].reset();
}

function setUserAttendance(eventID, attends) {

    $.securityCrucialAjaxPOST({
        url : managerProperties.services.SET_EVENT_ATTENDANCE,
        dataType : 'json',
        type : 'POST',
        async : true,
        data : "eventid=" + eventID + "&attends=" + attends
    }).success(function(errorDTO) {
            errorDTO.attends = attends;
            securityCrucialErrorHandler(errorDTO, _handleSetAttendanceErrors)
        }
    ).fail(function() {
            console.log("userattendance Query Failed")
        });
}

function _handleSetAttendanceErrors(errorDTO) {
    if(errorDTO.success) {
        if(errorDTO.attends == true) {
            showAlert(managerProperties.alertTypes.SUCCESS, "Sie haben erfolgreich zugesagt");
        } else if(errorDTO.attends == false) {
            showAlert(managerProperties.alertTypes.SUCCESS, "Sie haben erfolgreich abgesagt");
        } else {
            console.log("this should never happen")
        }
    } else {
        console.log("Internal Error. Set attendance")
    }
}

function handleLoadingButton(button) {
    var btn = $(button);
    btn.button('loading');
    setTimeout(function() {
//        btn.button('reset');
    }, managerProperties.MAX_TIMEOUTDURATION)
    // TODO: necessary? cant check right now cause the servers are down
//    btn.submit();
}

// modal functions (handle the display of event data via the popup window. will be moved to its own file)
// ---------------------------------------------------------------------------------------------------------------------
function showEventModal(event) {
    var eventID = $(event).attr("data-event-id");
    $.securityCrucialAjaxPOST({
        url : managerProperties.services.GET_EVENT_BY_ID,
        dataType : 'json',
        type : 'POST',
        async : true,
        data : "eventid=" + eventID
    }).success(function(errorDTO) {
            securityCrucialErrorHandler(errorDTO, fillEventModal)

    }).fail(function() {
            console.log("geteventbyid Query Failed")
    });
}

function fillEventModal(errorDTO) {
    if(!errorDTO.success) {
        showAlert(managerProperties.alertTypes.DANGER, "Ein Fehler ist aufgetreten")
        return;
    }
    resetModal();
    var event = errorDTO.content;
    var attendants = event.attendants;
    $('#modalTitle').html(event.title);
    var start = {};
    var end = {};
    start.date = new Date(parseInt(event.start));
    end.date = new Date(parseInt(event.end));
    start.hours = start.date.getHours() < 10 ? "0" + start.date.getHours() : start.date.getHours();
    start.minutes = start.date.getMinutes() < 10 ? "0" + start.date.getMinutes() : start.date.getMinutes();
    end.hours = end.date.getHours() < 10 ? "0" + end.date.getHours() : end.date.getHours();
    end.minutes = end.date.getMinutes() < 10 ? "0" + end.date.getMinutes() : end.date.getMinutes();
    $('#modalDateTime').html(
        start.date.toLocaleDateString() + " " +
        start.hours + ":" + start.minutes +
        " - " +
        end.date.toLocaleDateString() + " " +
        end.hours + ":" + end.minutes + "<br>"
    );
    $('#modalDescription').html(event.description);

    attendants.sort(function(a, b) {
        return a.lastName.toLowerCase() > b.lastName.toLowerCase();
    });

    // append a line of html for each user
    _.each(attendants, function(attendant) {
        var li = document.createElement("li");
        if(attendant.attends) {
            $(li).css("color", "green");
        }
        $(li).html(attendant.firstName + " " + attendant.lastName);
        $('#modalAttendants').append(li);
    });
}

function resetModal() {
    $('#modalTitle').html(" ");
    $('#modalDateTime').html(" ");
    $('#modalDescription').html(" ");
    $('#modalAttendants').html(" ")
}
// End of modal functions
// ---------------------------------------------------------------------------------------------------------------------

/* security abstraction layer
   these functions wrap existing functionality so one doesn't need to think about appending the sessionID for all the
   ajax requests to the webserver.
   Similiar structures apply to the error handler which will always check if the response from the server contains the
   INVALID_SESSION error and throw the user out if it occurs or calls the specific error handler if it doesn't
*/
// ---------------------------------------------------------------------------------------------------------------------
$.securityCrucialAjaxPOST = function(options) {
    if(managerProperties.userSessionStorageObject.SESSION_ID != null) {
        options.data += "&sessionid=" + sessionStorage.getItem(managerProperties.userSessionStorageObject.SESSION_ID);
    } else {
        console.log("WARNING: No sessionId found");
    }
    options.type = 'POST';
    return $.ajax(options);
};

// layer for all queries where the return object could contain INVALID_ID
// will be used with all functionality where the user needs to be logged in for
function securityCrucialErrorHandler(errorDTO, errorHandler) {
    if(errorDTO.success == 0
    && ($.inArray(managerProperties.sessionErrors.SESSION_INVALID, errorDTO.content) != -1)) {
        loadView(managerProperties.siteStates.LOGIN_SCREEN, function() {
            showAlert(managerProperties.alertTypes.DANGER, "Ihre Sitzung ist nichtmehr gültig, bitte melden sie sich neu an.");
        })
    } else {
        if(typeof errorHandler === 'function') { 
            errorHandler(errorDTO);
        }
    }
}
// End of abstraction layer
// ---------------------------------------------------------------------------------------------------------------------

// Initialize the page by loading the Index template first and initializing the sessionStorage
$(document).ready(function() {
    $.ajaxSetup({
        timeout: managerProperties.MAX_TIMEOUTDURATION
    });

    // Register a global error handler that resets the "Loading..." button
    $( document ).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
        console.log(event, jqXHR, ajaxSettings, thrownError);
        // Timeout will be set so the showAlert and the reset of the button happens at the same time
        setTimeout(function() {
            $('[data-loading-text]').button('reset');
        }, managerProperties.SLIDE_DURATION)
    });
    if(isStorageDefined() && (sessionStorage.visited == null)) {
        sessionStorage.currentSiteState = managerProperties.siteStates.LOGIN_SCREEN;
        sessionStorage.visited = true;
        loadView(sessionStorage.getItem(["currentSiteState"]));
    } else if (sessionStorage.visited == "true") {
        loadView(sessionStorage.getItem(["currentSiteState"]));
    } else {
        // TODO: implement error message for browsers without html5
        loadView(managerProperties.siteStates.LOGIN_SCREEN);
        console.log("No Storage object found");
        showAlert(managerProperties.alertTypes.DANGER,
            "Ihr Browser verfügt nicht über ein sessionStorage Objekt, die Seite wird nicht korrekt Funktioniern<br>" +
            "Bitte nutzen sie einen der Folgenden Browser:<br>" +
            "&#149; Internet Explorer 8 oder höher<br>" +
            "&#149; Firefox 3.5 oder höher<br>" +
            "&#149; Chrome 3 oder höher");
    }
});