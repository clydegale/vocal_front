function internalImport() {
	var calendar = $('#calendar').calendar({events_source: function() {
			return [
				{
			    	"id":"123",
					"title": "Mein Event",
					"url": "http://google.com",
					"class": "event-important",
					"start": "1382375654405",
					"end": "1382379254000"
				}
			];
		}
	});
}

function externalFileImport() {
	var calendar = $('#calendar').calendar({events_source: "events.json.php"});
}

function externalURLImport() {
	var calendar = $('#calendar').calendar({events_source: "https://63.141.251.75/mockup/events.json.php"});	
} 

function errorImport() {
	var calendar = $('#calendar').calendar({events_source: function(){
		alert("bla");
		return [
		{
			"success": 0,
			"error": "Error while loading"
		}];
	}});	
}
