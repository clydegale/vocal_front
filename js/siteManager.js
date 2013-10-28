"use strict";

// (function($) {
	
	var managerOptions = {
		templateDir : "tmpls/ui/",
		jsDir		: "js/",
		
	}	
	
	function loadOverview() {
		$.ajax({
			url: managerOptions.templateDir + 'overview.html',
			dataType: 'html',
			type: 'GET',
			async: true,
			//cache: true,
		})
		.done(function(html) {
			$('#contentLoggedIn').html(html);
		})
		.fail(function() {
			console.log("Error with AJAX Query to the overview.html template");
		})
		.always(function(){
			$('#home-navbar').addClass("active")
			$('#calendar-navbar').removeClass("active");
			$('#settings-navbar').removeClass("active")
		});
	}
	
	function loadCalendar() {
		$.ajax({
			url: managerOptions.templateDir + 'calendar.html',
			dataType: 'html',
			type: 'GET',
			async: true,
			//cache: true,
		})
		.done(function(html) {
			$('#contentLoggedIn').html(html);
			$.getScript(managerOptions.jsDir + "calendar.js");
			$.getScript(managerOptions.jsDir + "underscore-min.js");
			$.getScript(managerOptions.jsDir + "language/de-DE.js");
			$.getScript(managerOptions.jsDir + "app.js");
		})
		.fail(function() {
			console.log("Error with AJAX Query to the calendar.html template");
		})
		.always(function(){
			$('#home-navbar').removeClass("active")
			$('#calendar-navbar').addClass("active");
			$('#settings-navbar').removeClass("active")
		});	  
	}
	
	function loadSettings() {
		$.ajax({
			url: managerOptions.templateDir + 'settings.html',
			dataType: 'html',
			type: 'GET',
			async: true,
			//cache: true,
		})
		.done(function(html) {
			$('#contentLoggedIn').html(html);
		})
		.fail(function() {
			console.log("Error with AJAX Query to the settings.html template");
		})
		.always(function(){
			$('#home-navbar').removeClass("active")
			$('#calendar-navbar').removeClass("active");
			$('#settings-navbar').addClass("active")
		});		
	}
		
	$(document).ready(
		loadOverview()
	);
// }(jQuery));
