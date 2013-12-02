"using strict"

$('#loginForm').submit(function(event) {
    event.preventDefault();
    console.log("Default Prevented: Login");

    var form = $('#loginForm');
    $.ajax({
        url : managerProperties.services.LOGIN_USER_URL,
        dataType : 'json',
        type : 'POST',
        async : true,
        data : form.serialize()
    }).done(_handleLoginErrors
     ).fail(function() {
            console.log("login query failed");
            showAlert(managerProperties.alertTypes.DANGER, "Fehler beim Login");
     });
});

function _handleLoginErrors(errorDTO) {
    console.log(errorDTO);
    if(errorDTO.success) {
        _fillUserSession(errorDTO.content);
        loadOverview();
    } else {
        var errorMsg = "";
        if($.inArray(managerProperties.loginErrors.AUTHENTICATION_FAILED, errorDTO.content) != -1) {
            errorMsg = "Fehler beim Anmelden: Falsche E-Mail oder Passwort <br>";
        }
        if ($.inArray(managerProperties.loginErrors.INTERNAL_ERROR, errorDTO.content) != -1) {
            console.log(errorDTO.content);
            errorMsg += "Interner Fehler";
        }
        showAlert(managerProperties.alertTypes.DANGER, errorMsg);
    }
}

function _fillUserSession(content) {
    console.log("Success: Login");
    console.log(content);
    sessionStorage.setItem(managerProperties.userSessionStorageObject.SESSION_ID, content.sessionId);
    sessionStorage.setItem(managerProperties.userSessionStorageObject.FIRSTNAME, content.user.firstName);
    sessionStorage.setItem(managerProperties.userSessionStorageObject.LASTNAME, content.user.lastName);
    sessionStorage.setItem(managerProperties.userSessionStorageObject.EMAIL, content.user.email);
    sessionStorage.setItem(managerProperties.userSessionStorageObject.GRADE, content.user.grade);
    sessionStorage.setItem(managerProperties.userSessionStorageObject.SCHOOL_LOCATION, content.user.schoolLocation);
}