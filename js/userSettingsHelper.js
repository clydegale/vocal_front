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
        console.log(value);
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
    console.log("Default Prevented: AccountCreation");

    var form = $('#userEditForm');
    form.children('#editEmail').remove();
    $.securityCrucialAjaxPOST({
        url : managerProperties.services.EDIT_USER_URL,
        dataType : 'json',
        type : 'POST',
        async : true,
        data : form.serialize()
    }).success(_handleUserEditErrors
     ).fail(function() {
            console.log("userCreate Query Failed")
    });
});


// TODO: mark the form entries green on success
function _handleUserEditErrors(errorDTO) {
    console.log(errorDTO);
    if(errorDTO.success == 0) {
        showAlert(managerProperties.alertTypes.DANGER, "TEMP ERROR")
        // TODO: implement generic "kickout" method if sessionId is invalid and stop execution / throw user back to loginpage
    } else if (errorDTO.success == 1) {
        var errorMessage = "";
        if($.inArray(managerProperties.userEditSuccessCodes.FIRSTNAME_CHANGED, errorDTO.content.successcodes) != -1) {
            console.log("Changed Firstname");
            errorMessage += 'Ihr <b>Vorname</b> wurde geändert.<br>';
            sessionStorage.setItem(managerProperties.userSessionStorageObject.FIRSTNAME, errorDTO.content.user[managerProperties.userSessionStorageObject.FIRSTNAME])
        }
        if($.inArray(managerProperties.userEditSuccessCodes.LASTNAME_CHANGED, errorDTO.content.successcodes) != -1) {
            console.log("Changed Lastname");
            errorMessage += 'Ihr <b>Nachname</b> wurde geändert.<br>';
            sessionStorage.setItem(managerProperties.userSessionStorageObject.LASTNAME, errorDTO.content.user[managerProperties.userSessionStorageObject.LASTNAME])
        }
        if($.inArray(managerProperties.userEditSuccessCodes.SCHOOL_LOCATION_CHANGED, errorDTO.content.successcodes) != -1) {
            console.log("Changed SchoolLocation");
            errorMessage += 'Ihr <b>Standort</b> wurde geändert.';
            sessionStorage.setItem(managerProperties.userSessionStorageObject.SCHOOL_LOCATION, errorDTO.content.user[managerProperties.userSessionStorageObject.SCHOOL_LOCATION])
        }

        showAlert(managerProperties.alertTypes.SUCCESS, errorMessage);
        // TODO: update navbar content
    }



}