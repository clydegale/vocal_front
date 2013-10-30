"use strict"

function checkPasswordValidity(inputFormID) {
	var passwordForm = $(inputFormID);
	console.log(passwordForm);
}

/* Query the Webservice for all known location
 * Returned will be a JSON Data Transfer Object containing the
 * location Objects
 */
$.ajax({
    url : managerOptions.services.locationSelectorURL,
    dataType : 'json',
    type : 'GET',
    async : true
    //cache: true,
}).done(_generateLocationSelector
    ).fail(function() {
        console.log("Error");
});

// Helper function to fill the <select> tag with the locations
function _generateLocationSelector(locationsDTO) {
    var select = $('#locationSelector');

    // Put Object of Objects into an Array of Objects (for Sorting)
    var sortable = [];
    for (var object in locationsDTO) {
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