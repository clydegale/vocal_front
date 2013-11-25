"use strict";

console.log("properties loaded");

var managerProperties = {
    dirs: {
        TEMPLATE_UI : "tmpls/ui/",
        TEMPLATE_CALENDAR: "tmpls/calendar/",
        JS : "js/"
    },
    services : {
        LOCATION_SELECTOR_URL: "http://vocal.pi:8080/VoCalServices/MockService/getLocations",
        CREATE_USER_URL: "http://vocal.pi:8080/VoCalServices/UserMgmt/createUser"
    },
    siteStates: {
        LOGIN_SCREEN: "loginScreen",
        ACCOUNT_CREATION: "accountCreation",
        OVERVIEW: "overview",
        CALENDAR: "calendar",
        SETTINGS: "settings",
        NONE: null
    },
    alertTypes: {
        SUCCESS: "alert-success",
        INFO: "alert-info",
        WARNING: "alert-warning",
        DANGER: "alert-danger"
    },
    navbarButtons: {
        OVERVIEW: "navbar-home",
        CALENDAR: "navbar-calendar",
        SETTINGS: "navbar-settings"
    },
    userCreationErrors: {
        FIRSTNAME_MISSING: "FIRSTNAME_MISSING",
        LASTNAME_MISSING: "LASTNAME_MISSING",
        EMAIL_MISSING: "EMAIL_MISSING",
        GRADE_MISSING: "GRADE_MISSING",
        LOCATION_MISSING: "SCHOOL_MISSING",
        PASSWORD_MISSING: "PASSWORD_MISSING"
    },
    errorMessages: {
        FIELD_NOT_EMPTY_MSG: "Dieses Feld darf nicht leer sein"
    },
    SLIDE_DURATION: 500
};