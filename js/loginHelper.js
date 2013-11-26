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
    sessionStorage.setItem("sessionID", content.sessionId);
    sessionStorage.setItem("firstName", content.user.firstName);
    sessionStorage.setItem("lastName", content.user.lastName);
    sessionStorage.setItem("email", content.user.email);
    sessionStorage.setItem("grade", content.user.grade);
    sessionStorage.setItem("schoolLocation", content.user.schoolLocation);
}