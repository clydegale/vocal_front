"use strict"

function checkPasswordValidity(inputFormID) {
    var passwordForm = $(inputFormID);
    console.log(passwordForm);
}

/* Query the Webservice for all known locations
 * Returned will be a JSON Data Transfer Object containing the
 * location Objects
 */
$.ajax({
    url : managerProperties.services.LOCATION_SELECTOR_URL,
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
    var select = $('#location');

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

$('#accountCreationForm').submit(function(event) {
    event.preventDefault();
    console.log("Default Prevented");

    var form = $('#accountCreationForm');
    $.ajax({
        url : managerProperties.services.CREATE_USER_URL,
        dataType : 'json',
        type : 'POST',
        async : true,
        data : form.serialize()
    }).done(_handleUsercreationErrors

     ).fail(function() {
       console.log("userCreate Query Failed")
    });
});

function _handleUsercreationErrors(errorDTO) {
    console.log(errorDTO);
    console.log(errorDTO["success"]);
    console.log(errorDTO.content);
    if(errorDTO["success"]) {
        console.log("success == 1");
        loadLoginScreen();
        return
    }
    var errorMessage = "";
    if($.inArray(managerProperties.userCreationErrors.FIRSTNAME_MISSING, errorDTO.content) != -1) {
        console.log("Found missing firstname");
        $('#firstname').parent().parent().addClass("has-error");
        errorMessage += 'Das Feld <b>Vorname</b> darf nicht leer sein <br>'
    }
    if($.inArray(managerProperties.userCreationErrors.LASTNAME_MISSING, errorDTO.content) != -1) {
        console.log("Found missing lastname");
        $('#lastname').parent().parent().addClass("has-error");
        errorMessage += 'Das Feld <b>Nachname</b> darf nicht leer sein <br>'
    }
    if($.inArray(managerProperties.userCreationErrors.EMAIL_MISSING, errorDTO.content) != -1) {
        console.log("Found missing email");
        $('#email').parent().parent().addClass("has-error");
        errorMessage += 'Das Feld <b>E-Mail</b> darf nicht leer sein <br>'
    }
    if($.inArray(managerProperties.userCreationErrors.PASSWORD_MISSING, errorDTO.content) != -1) {
        console.log("Found missing password");
        $('#password').parent().parent().addClass("has-error");
        errorMessage += 'Das Feld <b>Password</b> darf nicht leer sein <br>'
    }
    if($.inArray(managerProperties.userCreationErrors.LOCATION_MISSING, errorDTO.content) != -1) {
        console.log("Found missing location");
        $('#location').parent().parent().addClass("has-error");
        errorMessage += 'Bitte Wählen sie einen <b>Standort</b> aus<br>'
    }
    if($.inArray(managerProperties.userCreationErrors.GRADE_MISSING, errorDTO.content) != -1) {
        console.log("Found missing grade");
        $('#grade').parent().parent().addClass("has-error");
        errorMessage += 'Bitte Wählen sie eine <b>Gürtelfarbe</b> aus<br>'
    }

    showAlert(managerProperties.alertTypes.DANGER, errorMessage)
}