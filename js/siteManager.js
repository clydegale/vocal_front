// TODO: disable top bar in every function

"use strict";

/*
 * The following functions will load the specific view using AJAX requests to the templates in tmpls/ui/
 */
function loadLoginScreen() {
    $.ajax({
        url : managerProperties.dirs.templateUIDir + 'loginScreen.html',
        dataType : 'html',
        type : 'GET',
        async : true
        //cache: true,
    }).done(function(html) {
            $('#contentMain').html(html);

            //Setting topbar buttons accordingly
            $('#navbar-content').addClass("invisible");

            //Update the current pageState
            _updateSessionStorage(managerProperties.siteStates.loginScreen)
        }).fail(function() {
            console.log("Error with AJAX Query to the index.html template");
        });
}

function loadAccountCreation() {
    $.ajax({
        url : managerProperties.dirs.templateUIDir + 'accountCreation.html',
        dataType : 'html',
        type : 'GET',
        async : true
        //cache: true,
    }).done(function(html) {
            $('#contentMain').html(html);

            //Setting topbar buttons accordingly
            $('#navbar-content').addClass("invisible");

            $.getScript(managerProperties.dirs.jsDir + "accountCreationHelper.js")

            //Update the current pageState
            _updateSessionStorage(managerProperties.siteStates.accountCreation)
        }).fail(function() {
            console.log("Error with AJAX Query to the accountCreation.html template");
        });
}

function loadOverview() {
	$.ajax({
		url : managerProperties.dirs.templateUIDir + 'overview.html',
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
		url : managerProperties.dirs.templateUIDir + 'calendar.html',
		dataType : 'html',
		type : 'GET',
		async : true
		//cache: true,
	}).done(function(html) {
		$('#contentMain').html(html);
		$('#navbar-home').removeClass("active");
		$('#navbar-calendar').addClass("active");
		$('#navbar-settings').removeClass("active");

		$.getScript(managerProperties.dirs.jsDir + "calendar.js");
		$.getScript(managerProperties.dirs.jsDir + "underscore-min.js");
		$.getScript(managerProperties.dirs.jsDir + "language/de-DE.js");
		$.getScript(managerProperties.dirs.jsDir + "app.js");

        //Update the current pageState
        _updateSessionStorage(managerProperties.siteStates.calendar)
	}).fail(function() {
		console.log("Error with AJAX Query to the calendar.html template");
	});
}

function loadSettings() {
	$.ajax({
		url : managerProperties.dirs.templateUIDir + 'settings.html',
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

function _setNavbarButtons(buttonName) {
    var buttons = $('#navbar-buttons').children()
}

function logout() { // TODO: write so the server will be notified when user logs out
    sessionStorage.clear();
    loadLoginScreen();
}

function closeAlert(button) {
    $(button).parent(".alert").slideUp(500)
}

function showAlert(alertType, message) {
    alertArea = $('#alertArea')
}

// ---------------------

// Initialize the page by loading the Index template first
if(isStorageDefined() && (sessionStorage.visited == null)) {
    sessionStorage.currentSiteState = managerProperties.siteStates.index
    sessionStorage.visited = true;
} else {
    console.log("No Storage object found") // TODO: Show bootstrap error message here
}
$(document).ready(loadCurrentState(sessionStorage.getItem(["currentSiteState"])));
