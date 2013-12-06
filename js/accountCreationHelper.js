"use strict"

/* Query the Webservice for all known locations
 * Returned will be a JSON Data Transfer Object containing the
 * location Objects
 * _generateLocationSelector is defined in siteManager.js
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

// TODO: show AJAX loading gif while executing query
$('#accountCreationForm').submit(function(event) {
    event.preventDefault();
    console.log("Default Prevented: AccountCreation");

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
    // TODO: access success with errorDTO.success (and test)
    if(errorDTO["success"]) {
        console.log("success == 1");
        loadView(managerProperties.siteStates.LOGIN_SCREEN, function() {
            showAlert(managerProperties.alertTypes.SUCCESS, "Ihr Benutzeraccount wurde erforlgreich erstellt") // += sie können sich einloggen wenn ein admin sie freigeschalten hat
        });
        return
    }
    var errorMessage = "";
    // TODO: add delay, so fields wont show up as red before the error message is displayed
    if($.inArray(managerProperties.userCreationErrors.FIRSTNAME_MISSING, errorDTO.content) != -1) {
        console.log("Found missing firstname");
        $('#firstname').parents(".form-group").addClass("has-error");
        errorMessage += 'Das Feld <b>Vorname</b> darf nicht leer sein <br>'
    }
    if($.inArray(managerProperties.userCreationErrors.LASTNAME_MISSING, errorDTO.content) != -1) {
        console.log("Found missing lastname");
        $('#lastname').parents(".form-group").addClass("has-error");
        errorMessage += 'Das Feld <b>Nachname</b> darf nicht leer sein <br>'
    }
    if($.inArray(managerProperties.userCreationErrors.EMAIL_MISSING, errorDTO.content) != -1) {
        console.log("Found missing email");
        $('#email').parents(".form-group").addClass("has-error");
        errorMessage += 'Das Feld <b>E-Mail</b> darf nicht leer sein <br>'
    }
    if($.inArray(managerProperties.userCreationErrors.PASSWORD_MISSING, errorDTO.content) != -1) {
        console.log("Found missing password");
        $('#password').parents(".form-group").addClass("has-error");
        errorMessage += 'Das Feld <b>Password</b> darf nicht leer sein <br>'
    }
    if($.inArray(managerProperties.userCreationErrors.SCHOOL_LOCATION_MISSING, errorDTO.content) != -1) {
        console.log("Found missing location");
        $('#schoollocation').parents(".form-group").addClass("has-error");
        errorMessage += 'Bitte Wählen sie einen <b>Standort</b> aus<br>'
    }
    if($.inArray(managerProperties.userCreationErrors.GRADE_MISSING, errorDTO.content) != -1) {
        console.log("Found missing grade");
        $('#grade').parents(".form-group").addClass("has-error");
        errorMessage += 'Bitte Wählen sie eine <b>Gürtelfarbe</b> aus<br>'
    }
    // TODO: Test
    if($.inArray(managerProperties.userCreationErrors.EMAIL_INVALID, errorDTO.content) != -1) {
        console.log("Invalid E-Mail");
        $('#email').parents(".form-group").addClass("has-error");
        errorMessage += 'Bitte geben sie eine gültige <b>E-Mail Adresse</b> an<br>'
    }
    if($.inArray(managerProperties.userCreationErrors.EMAIL_ALREADY_IN_USE, errorDTO.content) != -1) {
        console.log("Email in use");
        $('#email').parents(".form-group").addClass("has-error");
        errorMessage += 'Die angegebene <b>E-Mail</b> wird bereit verwendet.<br>'
    }
    if($.inArray(managerProperties.userCreationErrors.PASSWORD_TOO_SHORT, errorDTO.content) != -1) {
        console.log("Short password");
        $('#password').parents(".form-group").addClass("has-error");
        errorMessage += 'Bitte Wählen sie ein <b>Passwort</b> mit mindestens sechs Zeichen. <br>'
    }
    if($.inArray(managerProperties.userCreationErrors.PASSWORDS_DONT_MATCH, errorDTO.content) != -1) {
        console.log("Passwords dont match");
        $('#password').parents(".form-group").addClass("has-error");
        errorMessage += 'Ihre eingegeben <b>Passwörter</b> stimmen nicht überein.<br>'
    }

    showAlert(managerProperties.alertTypes.DANGER, errorMessage)
}