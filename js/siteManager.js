"use strict";

/*
 * The following functions will load the specific view using AJAX requests to the templates in tmpls/ui/
 */
function loadLoginScreen() {
    $.ajax({
        url : managerProperties.dirs.templateDir + 'loginScreen.html',
        dataType : 'html',
        type : 'GET',
        async : true
        //cache: true,
    }).done(function(html) {
            $('#contentMain').html(html);

            //Setting topbar buttons accordingly
            $('#navbar-home').addClass("active");
            $('#navbar-calendar').removeClass("active");
            $('#navbar-settings').removeClass("active");

            //Update the current pageState
            _updateSessionStorage(managerProperties.siteStates.loginScreen)
        }).fail(function() {
            console.log("Error with AJAX Query to the index.html template");
        });
}

function loadAccountCreation() {
    $.ajax({
        url : managerProperties.dirs.templateDir + 'accountCreation.html',
        dataType : 'html',
        type : 'GET',
        async : true
        //cache: true,
    }).done(function(html) {
            $('#contentMain').html(html);

            //Setting topbar buttons accordingly
            $('#navbar-home').addClass("active");
            $('#navbar-calendar').removeClass("active");
            $('#navbar-settings').removeClass("active");

            $.getScript(managerProperties.jsDir + "accountCreationHelper.js")

            //Update the current pageState
            _updateSessionStorage(managerProperties.siteStates.accountCreation)
        }).fail(function() {
            console.log("Error with AJAX Query to the accountCreation.html template");
        });
}

function loadOverview() {
	$.ajax({
		url : managerProperties.dirs.templateDir + 'overview.html',
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
        _updateSessionStorage(managerProperties.siteStates.overview)
	}).fail(function() {
		console.log("Error with AJAX Query to the overview.html template");
	});
}

function loadCalendar() {
	$.ajax({
		url : managerProperties.dirs.templateDir + 'calendar.html',
		dataType : 'html',
		type : 'GET',
		async : true,
		//cache: true,
	}).done(function(html) {
		$('#contentMain').html(html);
		$('#navbar-home').removeClass("active");
		$('#navbar-calendar').addClass("active");
		$('#navbar-settings').removeClass("active");

		$.getScript(managerProperties.jsDir + "calendar.js");
		$.getScript(managerProperties.jsDir + "underscore-min.js");
		$.getScript(managerProperties.jsDir + "language/de-DE.js");
		$.getScript(managerProperties.jsDir + "app.js");

        //Update the current pageState
        _updateSessionStorage(managerProperties.siteStates.calendar)
	}).fail(function() {
		console.log("Error with AJAX Query to the calendar.html template");
	});
}

function loadSettings() {
	$.ajax({
		url : managerProperties.dirs.templateDir + 'settings.html',
		dataType : 'html',
		type : 'GET',
		async : true,
		//cache: true,
	}).done(function(html) {
		$('#contentMain').html(html);
		$('#navbar-home').removeClass("active");
		$('#navbar-calendar').removeClass("active");
		$('#navbar-settings').addClass("active");

        //Update the current pageState
        _updateSessionStorage(managerProperties.siteStates.settings)
	}).fail(function() {
		console.log("Error with AJAX Query to the settings.html template");
	});
}

function loadCurrentState(currentState) {
    switch (currentState) {
        case managerProperties.siteStates.loginScreen:
            loadLoginScreen()
            break;
        case managerProperties.siteStates.accountCreation:
            loadAccountCreation()
            break;
        case managerProperties.siteStates.overview:
            loadOverview()
            break;
        case managerProperties.siteStates.calendar:
            loadCalendar()
            break;
        case managerProperties.siteStates.settings:
            loadSettings()
            break;
        default:
            loadLoginScreen()

    }
}

function isStorageDefined() {
    if(Storage != undefined) {
        return true
    } else {
        return false
    }
}

function _updateSessionStorage(currentSiteState) {
    sessionStorage.setItem("currentSiteState", currentSiteState)
}

function debug_clearSessionStorage() {
    sessionStorage.clear()
}

function logout() { // TODO: write so the server will be notified when user logs out
    sessionStorage.clear();
    loadLoginScreen();
}

// ---------------------

// Initialize the page by loading the Index template first
if(isStorageDefined() && (sessionStorage.firstVisit == null)) {
    sessionStorage.currentSiteState = managerProperties.siteStates.index
    sessionStorage.firstVisit = true;
} else {
    console.log("No Storage object found") // TODO: Show bootstrap error message here
}
$(document).ready(loadCurrentState(sessionStorage.getItem(["currentSiteState"])));
