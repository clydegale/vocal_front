"use strict";

/*
 * The following three functions will load the specific view using AJAX requests to the templates in tmpls/ui/
 */
function loadLoginScreen() {
    $.ajax({
        url : managerOptions.dirs.templateDir + 'loginScreen.html',
        dataType : 'html',
        type : 'GET',
        async : true,
        //cache: true,
    }).done(function(html) {
            $('#contentMain').html(html);

            //Setting topbar buttons accordingly
            $('#navbar-home').addClass("active");
            $('#navbar-calendar').removeClass("active");
            $('#navbar-settings').removeClass("active");

            //Update the current pageState
            $.miniMenu.currentSiteState = managerOptions.siteStates.loginScreen;
        }).fail(function() {
            console.log("Error with AJAX Query to the index.html template");
        });
}

function loadAccountCreation() {
    $.ajax({
        url : managerOptions.dirs.templateDir + 'accountCreation.html',
        dataType : 'html',
        type : 'GET',
        async : true,
        //cache: true,
    }).done(function(html) {
            $('#contentMain').html(html);

            //Setting topbar buttons accordingly
            $('#navbar-home').addClass("active");
            $('#navbar-calendar').removeClass("active");
            $('#navbar-settings').removeClass("active");

            $.getScript(managerOptions.jsDir + "accountCreationHelper.js")

            //Update the current pageState  
            $.miniMenu.currentSiteState = managerOptions.siteStates.accountCreation;
        }).fail(function() {
            console.log("Error with AJAX Query to the accountCreation.html template");
        });
}

function loadOverview() {
	$.ajax({
		url : managerOptions.dirs.templateDir + 'overview.html',
		dataType : 'html',
		type : 'GET',
		async : true
		//cache: true,
	}).done(function(html) {
		$('#contentMain').html(html);

        // Unhide toolbar buttons
        $('navbar-content').removeClass("invisible");
		//Setting topbar buttons accordingly
		$('#navbar-home').addClass("active");
		$('#navbar-calendar').removeClass("active");
		$('#navbar-settings').removeClass("active");

        //Update the current pageState
        $.miniMenu.currentSiteState = managerOptions.siteStates.overview
	}).fail(function() {
		console.log("Error with AJAX Query to the overview.html template");
	});
}

function loadCalendar() {
	$.ajax({
		url : managerOptions.dirs.templateDir + 'calendar.html',
		dataType : 'html',
		type : 'GET',
		async : true,
		//cache: true,
	}).done(function(html) {
		$('#contentMain').html(html);
		$('#navbar-home').removeClass("active");
		$('#navbar-calendar').addClass("active");
		$('#navbar-settings').removeClass("active");

		$.getScript(managerOptions.jsDir + "calendar.js");
		$.getScript(managerOptions.jsDir + "underscore-min.js");
		$.getScript(managerOptions.jsDir + "language/de-DE.js");
		$.getScript(managerOptions.jsDir + "app.js");

        //Update the current pageState
        $.miniMenu.currentSiteState = managerOptions.siteStates.calendar
	}).fail(function() {
		console.log("Error with AJAX Query to the calendar.html template");
	});
}

function loadSettings() {
	$.ajax({
		url : managerOptions.dirs.templateDir + 'settings.html',
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
        $.miniMenu.currentSiteState = managerOptions.siteStates.settings
	}).fail(function() {
		console.log("Error with AJAX Query to the settings.html template");
	});
}

function loadCurrentState(currentState) {
    switch (currentState) {
        case managerOptions.siteStates.loginScreen:
            loadLoginScreen()
            break;
        case managerOptions.siteStates.accountCreation:
            loadAccountCreation()
            break;
        case managerOptions.siteStates.overview:
            loadOverview()
            break;
        case managerOptions.siteStates.calendar:
            loadCalendar()
            break;
        case managerOptions.siteStates.settings:
            loadSettings()
            break;
        default:
            loadLoginScreen()

    }
}
// ---------------------

// Initialize the page by loading the Index template first
window.currentState = managerOptions.siteStates.index
$.miniMenu = new Object();
$.miniMenu.currentSiteState = managerOptions.siteStates.index
$(document).ready(loadCurrentState(window.currentState));
