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

function populateAccountEditForm() {
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
    populateAccountEditForm();
}

// TODO: wrap jQuery Ajax call to include sessionid in all security crucial queries
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
    }).success(_handleUserEditErrors(data, code, jqXHR, "Hallo")
     ).fail(function() {
            console.log("userCreate Query Failed")
    });
});

function _handleUserEditErrors(errorDTO) {
    console.log(errorDTO);
//    if(errorDTO.success == 0) {
//
//    }


}