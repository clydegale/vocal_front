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
    var select = $('#schoollocation');

    // Put Object of Objects into an Array of Objects (for Sorting)
    var sortable = [];
    for (var object in locationsDTO) {
        // may or may not be a hack
        if(locationsDTO[object] == null) {
            continue
        }
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

// TODO: show AJAX loading gif while executing query
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
        // TODO: show success message after loading loginpage
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
    if($.inArray(managerProperties.userCreationErrors.SCHOOL_LOCATION_MISSING, errorDTO.content) != -1) {
        console.log("Found missing location");
        $('#schoollocation').parent().parent().addClass("has-error");
        errorMessage += 'Bitte Wählen sie einen <b>Standort</b> aus<br>'
    }
    if($.inArray(managerProperties.userCreationErrors.GRADE_MISSING, errorDTO.content) != -1) {
        console.log("Found missing grade");
        $('#grade').parent().parent().addClass("has-error");
        errorMessage += 'Bitte Wählen sie eine <b>Gürtelfarbe</b> aus<br>'
    }
    // TODO: Test
    if($.inArray(managerProperties.userCreationErrors.EMAIL_INVALID, errorDTO.content) != -1) {
        console.log("Invalid E-Mail");
        $('#email').parent().parent().addClass("has-error");
        errorMessage += 'Bitte geben sie eine gültige <b>E-Mail Adresse</b> an<br>'
    }
    if($.inArray(managerProperties.userCreationErrors.EMAIL_ALREADY_IN_USE, errorDTO.content) != -1) {
        console.log("Email in use");
        $('#email').parent().parent().addClass("has-error");
        errorMessage += 'Die angegebene <b>E-Mail</b> wird bereit verwendet.'
    }
    if($.inArray(managerProperties.userCreationErrors.PASSWORD_TOO_SHORT, errorDTO.content) != -1) {
        console.log("Short password");
        $('#password').parent().parent().addClass("has-error");
        errorMessage += 'Bitte Wählen sie ein <b>Passwort</b> mit mindestens sechs Zeichen'
    }
    if($.inArray(managerProperties.userCreationErrors.PASSWORDS_DONT_MATCH, errorDTO.content) != -1) {
        console.log("Passwords dont match");
        $('#password').parent().parent().addClass("has-error");
        errorMessage += 'Ihre eingegeben <b>Passwörter</b> stimmen nicht überein'
    }

    showAlert(managerProperties.alertTypes.DANGER, errorMessage)
}