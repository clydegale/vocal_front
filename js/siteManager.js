"use strict";

/*
 * The following functions will load the specific view using AJAX requests to the templates in tmpls/ui/
 */
function loadLoginScreen() {
    beforeRedirect();
    $.ajax({
        url : managerProperties.dirs.TEMPLATE_UI + 'loginScreen.html',
        dataType : 'html',
        type : 'GET',
        async : true
        //cache: true,
    }).done(function(html) {
            $('#contentMain').html(html);

            //Setting topbar buttons accordingly
            $('#navbar-content').addClass("invisible");

            $.getScript(managerProperties.dirs.JS + "loginHelper.js");

            //Update the current pageState
            _updateCurrentSiteState(managerProperties.siteStates.LOGIN_SCREEN)
        }).fail(function() {
            console.log("Error with AJAX Query to the index.html template");
        });
}

function loadAccountCreation() {
    $.ajax({
        url : managerProperties.dirs.TEMPLATE_UI + 'accountCreation.html',
        dataType : 'html',
        type : 'GET',
        async : true
        //cache: true,
    }).done(function(html) {
            $('#contentMain').html(html);

            //Setting topbar buttons accordingly
            $('#navbar-content').addClass("invisible");

            $.getScript(managerProperties.dirs.JS + "accountCreationHelper.js");

            //Update the current pageState
            _updateCurrentSiteState(managerProperties.siteStates.ACCOUNT_CREATION)
        }).fail(function() {
            console.log("Error with AJAX Query to the accountCreation.html template");
        });
}

function loadOverview() {
	$.ajax({
		url : managerProperties.dirs.TEMPLATE_UI + 'overview.html',
		dataType : 'html',
		type : 'GET',
		async : true
		//cache: true,
	}).done(function(html) {
		$('#contentMain').html(html);

        // Unhide toolbar buttons
        $('#navbar-content').removeClass("invisible");
        console.log(sessionStorage)
        $('#navbar-username').html(sessionStorage.getItem("firstName") + " " + sessionStorage.getItem("lastName"));
		//Setting topbar buttons accordingly
		_setNavbarButtons(managerProperties.navbarButtons.OVERVIEW);

        //Update the current pageState
        _updateCurrentSiteState(managerProperties.siteStates.OVERVIEW);
	}).fail(function() {
		console.log("Error with AJAX Query to the overview.html template");
	});
}

function loadCalendar() {
	$.ajax({
		url : managerProperties.dirs.TEMPLATE_UI + 'calendar.html',
		dataType : 'html',
		type : 'GET',
		async : true
		//cache: true,
	}).done(function(html) {
		$('#contentMain').html(html);
        // Unhide toolbar buttons
        $('#navbar-content').removeClass("invisible");
        _setNavbarButtons(managerProperties.navbarButtons.CALENDAR);

		$.getScript(managerProperties.dirs.JS + "calendar.js");
		$.getScript(managerProperties.dirs.JS + "underscore-min.js");
		$.getScript(managerProperties.dirs.JS + "language/de-DE.js");
		$.getScript(managerProperties.dirs.JS + "app.js");

        //Update the current pageState
        _updateCurrentSiteState(managerProperties.siteStates.CALENDAR)
	}).fail(function() {
		console.log("Error with AJAX Query to the calendar.html template");
	});
}

function loadUserSettings() {
	$.ajax({
		url : managerProperties.dirs.TEMPLATE_UI + 'userSettings.html',
		dataType : 'html',
		type : 'GET',
		async : true
		//cache: true,
	}).done(function(html) {
		$('#contentMain').html(html);
        // Unhide toolbar buttons
        $('#navbar-content').removeClass("invisible");
        _setNavbarButtons(managerProperties.navbarButtons.SETTINGS);

        $.getScript(managerProperties.dirs.JS + "userSettingsHelper.js", function(data, textStatus, jqxhr) {
            //populateAccountEditForm()
        });

        //Update the current pageState
        _updateCurrentSiteState(managerProperties.siteStates.USER_SETTINGS)
	}).fail(function() {
		console.log("Error with AJAX Query to the userSettings.html template");
	});
}

function loadCurrentState(currentState) {
    switch (currentState) {
        case managerProperties.siteStates.LOGIN_SCREEN:
            loadLoginScreen();
            break;
        case managerProperties.siteStates.ACCOUNT_CREATION:
            loadAccountCreation();
            break;
        case managerProperties.siteStates.OVERVIEW:
            loadOverview();
            break;
        case managerProperties.siteStates.CALENDAR:
            loadCalendar();
            break;
        case managerProperties.siteStates.USER_SETTINGS:
            loadUserSettings();
            break;
        default:
            loadLoginScreen();

    }
}

function isStorageDefined() {
    return ((Storage != undefined) && (window.sessionStorage != undefined));
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

function logoutUser() { // TODO: write so the server will be notified when user logs out
    $.ajax({
        url : managerProperties.services.LOGOUT_USER_URL,
        dataType : 'json',
        type : 'POST',
        async : true,
        data: "sessionId=" + sessionStorage.getItem("sessionId")
    }).done(function(data) {

    }).fail(function() {
        console.log("userCreate Query Failed")
    });
    sessionStorage.clear();
    loadLoginScreen();
}

function closeAlert(button) {
    var alertArea = $(button).parent(".alert");
    alertArea.slideUp(managerProperties.SLIDE_DURATION);
    // Need to set Timeout so the colors wont change while the slide animation is still going
    setTimeout(function() {
        _resetAlertType(alertArea);
    }, managerProperties.SLIDE_DURATION);
}

function showAlert(alertType, message) {
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

function _resetAlertType(alertArea) {
    alertArea.removeClass(managerProperties.alertTypes.DANGER);
    alertArea.removeClass(managerProperties.alertTypes.SUCCESS);
    alertArea.removeClass(managerProperties.alertTypes.WARNING);
    alertArea.removeClass(managerProperties.alertTypes.INFO);
}

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
// ---------------------
function beforeRedirect() {

}
// Initialize the page by loading the Index template first
$(document).ready(function() {
    console.log("Document Ready");
    if(isStorageDefined() && (sessionStorage.visited == null)) {
        console.log("Storage defined; not yet visted");
        sessionStorage.currentSiteState = managerProperties.siteStates.LOGIN_SCREEN;
        sessionStorage.visited = true;
        loadCurrentState(sessionStorage.getItem(["currentSiteState"]));
    } else if (sessionStorage.visited == "true") {
        console.log("Storage defined; visted");
        loadCurrentState(sessionStorage.getItem(["currentSiteState"]));
    } else {
        // TODO: implement error message for browsers without html5
        loadLoginScreen();
        console.log("No Storage object found");
        showAlert(managerProperties.alertTypes.DANGER, "Ihr Browser verfügt nicht über ein sessionStorage Objekt, die Seite wird nicht korrekt Funktioniern<br>" +
            "Bitte nutzen sie einen der Folgenden Browser:<br>" +
            "&#149; Internet Explorer 8 oder höher<br>" +
            "&#149; Firefox 3.5 oder höher<br>" +
            "&#149; Chrome 3 oder höher")
    }
});