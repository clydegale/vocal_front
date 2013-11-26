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
        });
});

function _handleLoginErrors(errorDTO) {
    console.log(errorDTO);
    if(errorDTO.success) {
        _fillUserSession(errorDTO.content);
        loadOverview();
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