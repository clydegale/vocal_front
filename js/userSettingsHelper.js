"using strict"
// Query the server for all
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

function populateAccountEditForm() {
    $('#editFirstname').attr("value", sessionStorage.getItem(managerProperties.userSessionStorageObject.FIRSTNAME));
    $('#editLastname').attr("value", sessionStorage.getItem(managerProperties.userSessionStorageObject.LASTNAME));
    $('#editEmail').attr("value", sessionStorage.getItem(managerProperties.userSessionStorageObject.EMAIL));
    //$('#editSchoollocation')
}