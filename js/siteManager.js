"use strict";

/*
 * The following three functions will load the specific view using AJAX requests to the templates in tmpls/ui/
 */
function loadOverview() {
	$.ajax({
		url : managerOptions.dirs.templateDir + 'overview.html',
		dataType : 'html',
		type : 'GET',
		async : true,
		//cache: true,
	}).done(function(html) {
		$('#contentLoggedIn').html(html);
		
		//Setting topbar buttons accordingly
		$('#home-navbar').addClass("active");
		$('#calendar-navbar').removeClass("active");
		$('#settings-navbar').removeClass("active");
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
		$('#contentLoggedIn').html(html);
		$('#home-navbar').removeClass("active");
		$('#calendar-navbar').addClass("active");
		$('#settings-navbar').removeClass("active");

		$.getScript(managerOptions.jsDir + "calendar.js");
		$.getScript(managerOptions.jsDir + "underscore-min.js");
		$.getScript(managerOptions.jsDir + "language/de-DE.js");
		$.getScript(managerOptions.jsDir + "app.js");
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
		$('#contentLoggedIn').html(html);
		$('#home-navbar').removeClass("active");
		$('#calendar-navbar').removeClass("active");
		$('#settings-navbar').addClass("active");
	}).fail(function() {
		console.log("Error with AJAX Query to the settings.html template");
	});
}
// ---------------------

// Initialize the page by loading the Overview template first
$(document).ready(loadOverview());
