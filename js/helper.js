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
	var calendar = $('#calendar').calendar({events_source: "eventsNew.json.php"});
}

function externalURLImport() {
	var calendar = $('#calendar').calendar({events_source: "http://vocal.pi/eventsNew.json.php"});	
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
