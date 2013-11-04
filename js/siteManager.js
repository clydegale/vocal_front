// TODO: disable top bar in every function

"use strict";

/*
 * The following functions will load the specific view using AJAX requests to the templates in tmpls/ui/
 */
function loadLoginScreen() {
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

            //Update the current pageState
            _updateSessionStorage(managerProperties.siteStates.LOGIN_SCREEN)
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
            _updateSessionStorage(managerProperties.siteStates.ACCOUNT_CREATION)
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
		//Setting topbar buttons accordingly
		$('#navbar-home').addClass("active");
		$('#navbar-calendar').removeClass("active");
		$('#navbar-settings').removeClass("active");

        //Update the current pageState
        _updateSessionStorage(managerProperties.siteStates.OVERVIEW)
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
		$('#navbar-home').removeClass("active");
		$('#navbar-calendar').addClass("active");
		$('#navbar-settings').removeClass("active");

		$.getScript(managerProperties.dirs.JS + "calendar.js");
		$.getScript(managerProperties.dirs.JS + "underscore-min.js");
		$.getScript(managerProperties.dirs.JS + "language/de-DE.js");
		$.getScript(managerProperties.dirs.JS + "app.js");

        //Update the current pageState
        _updateSessionStorage(managerProperties.siteStates.CALENDAR)
	}).fail(function() {
		console.log("Error with AJAX Query to the calendar.html template");
	});
}

function loadSettings() {
	$.ajax({
		url : managerProperties.dirs.TEMPLATE_UI + 'settings.html',
		dataType : 'html',
		type : 'GET',
		async : true
		//cache: true,
	}).done(function(html) {
		$('#contentMain').html(html);
		$('#navbar-home').removeClass("active");
		$('#navbar-calendar').removeClass("active");
		$('#navbar-settings').addClass("active");

        //Update the current pageState
        _updateSessionStorage(managerProperties.siteStates.SETTINGS)
	}).fail(function() {
		console.log("Error with AJAX Query to the settings.html template");
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
        case managerProperties.siteStates.SETTINGS:
            loadSettings();
            break;
        default:
            loadLoginScreen();

    }
}

function isStorageDefined() {
    return Storage != undefined
}

function _updateSessionStorage(currentSiteState) {
    sessionStorage.setItem("currentSiteState", currentSiteState);
}

// TODO: Implement
//function _setNavbarButtons(buttonName) {
//    var buttons = $('#navbar-buttons').children();
//}

function logout() { // TODO: write so the server will be notified when user logs out
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
    }, managerProperties.SLIDE_DURATION);
}

function _resetAlertType(alertArea) {
    alertArea.removeClass(managerProperties.alertTypes.DANGER);
    alertArea.removeClass(managerProperties.alertTypes.SUCCESS);
    alertArea.removeClass(managerProperties.alertTypes.WARNING);
    alertArea.removeClass(managerProperties.alertTypes.INFO);
}
// ---------------------

// Initialize the page by loading the Index template first
if(isStorageDefined() && (sessionStorage.visited == null)) {
    sessionStorage.currentSiteState = managerProperties.siteStates.index;
    sessionStorage.visited = true;
} else {
    console.log("No Storage object found"); // TODO: Show bootstrap error message here
}
$(document).ready(loadCurrentState(sessionStorage.getItem(["currentSiteState"])));
