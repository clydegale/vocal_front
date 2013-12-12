// Query the server for all

$.ajax({
    url : managerProperties.services.LOCATION_SELECTOR_URL,
    dataType : 'json',
    type : 'GET',
    async : true
    //cache: true,
}).done(initUserSettingsView
 ).fail(function() {
        console.log("Error");
});

function _populateAccountEditForm() {
    $('#editFirstname').attr("value", sessionStorage.getItem(managerProperties.userSessionStorageObject.FIRSTNAME));
    $('#editLastname').attr("value", sessionStorage.getItem(managerProperties.userSessionStorageObject.LASTNAME));
    $('#editEmail').attr("value", sessionStorage.getItem(managerProperties.userSessionStorageObject.EMAIL));
    $('#editSchoollocation').children().each(function(index, value) {
        var option = $(value);
        if(option.attr("value") == sessionStorage.getItem(managerProperties.userSessionStorageObject.SCHOOL_LOCATION)) {
            option.attr("selected", "selected");
        }
    });
}

// Wrapper function to initialize the userSettingsView so we won't run into a racecondition
function initUserSettingsView(locationsDTO) {
    _generateLocationSelector(locationsDTO);
    _populateAccountEditForm();
}

$('#userEditForm').submit(function(event) {
    event.preventDefault();

    var form = $('#userEditForm');
    form.children('#editEmail').remove();
    $.securityCrucialAjaxPOST({
        url : managerProperties.services.EDIT_USER_URL,
        dataType : 'json',
        type : 'POST',
        async : true,
        data : form.serialize()
    }).success(function(errorDTO) {
            securityCrucialErrorHandler(errorDTO, _handleUserEditErrors)
    }).fail(function() {
            console.log("userCreate Query Failed")
    });
});


function _handleUserEditErrors(errorDTO) {
    if(errorDTO.success == 0) {
        // invalid session id is handled by the securityCrucialErrorHandler
        showAlert(managerProperties.alertTypes.DANGER, "Something bad happened")
    } else if (errorDTO.success == 1) {
        var errorMessage = "";
        if($.inArray(managerProperties.userEditSuccessCodes.FIRSTNAME_CHANGED, errorDTO.content.successcode) != -1) {
            errorMessage += 'Ihr <b>Vorname</b> wurde geändert.<br>';
            sessionStorage.setItem(managerProperties.userSessionStorageObject.FIRSTNAME, errorDTO.content.user[managerProperties.userSessionStorageObject.FIRSTNAME])
        }
        if($.inArray(managerProperties.userEditSuccessCodes.LASTNAME_CHANGED, errorDTO.content.successcode) != -1) {
            errorMessage += 'Ihr <b>Nachname</b> wurde geändert.<br>';
            sessionStorage.setItem(managerProperties.userSessionStorageObject.LASTNAME, errorDTO.content.user[managerProperties.userSessionStorageObject.LASTNAME])
        }
        if($.inArray(managerProperties.userEditSuccessCodes.SCHOOL_LOCATION_CHANGED, errorDTO.content.successcode) != -1) {
            errorMessage += 'Ihr <b>Standort</b> wurde geändert.';
            sessionStorage.setItem(managerProperties.userSessionStorageObject.SCHOOL_LOCATION, errorDTO.content.user[managerProperties.userSessionStorageObject.SCHOOL_LOCATION])
        }

        showAlert(managerProperties.alertTypes.SUCCESS, errorMessage);
        // TODO: update navbar content
        // update the form and name in the navbar
        _populateAccountEditForm();
        $('#navbar-username').html(sessionStorage.getItem("firstName") + " " + sessionStorage.getItem("lastName"));
    }



}