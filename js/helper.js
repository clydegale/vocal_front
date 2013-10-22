function internalImport() {
	var calendar = $('#calendar').calendar({events_source: function() {
			return [
				{
			    	"id":"123",
					"title": "Mein Event",
					"url": "google.com",
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
	var calendar = $('#calendar').calendar({events_source: "http://vocal.pi/events.json.php"});	
} 

function errorImport() {
	var calendar = $('#calendar').calendar({events_source: function() {
			return [
				{
				    "success": 0,
				    "error": "error message here"
				}
			];
		}
	});	
}
