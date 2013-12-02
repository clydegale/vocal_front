"use strict";

console.log("properties loaded");

var managerProperties = {
    dirs: {
        TEMPLATE_UI :       "tmpls/ui/",
        TEMPLATE_CALENDAR:  "tmpls/calendar/",
        JS :                "js/"
    },
    services : {
        LOCATION_SELECTOR_URL:  "http://5.9.99.52:10080/VoCalServices/LocationMgmt/getLocations",
        CREATE_USER_URL:        "http://5.9.99.52:10080/VoCalServices/UserMgmt/createUser",
        LOGIN_USER_URL:         "http://5.9.99.52:10080/VoCalServices/SessionMgmt/login",
        LOGOUT_USER_URL:        "http://5.9.99.52:10080/VoCalServices/SessionMgmt/logout",
        EDIT_USER_URL:          "http://5.9.99.52:10080/VoCalServices/UserMgmt/editUser"
    },
    siteStates: {
        LOGIN_SCREEN:       "loginScreen",
        ACCOUNT_CREATION:   "accountCreation",
        OVERVIEW:           "overview",
        CALENDAR:           "calendar",
        USER_SETTINGS:      "userSettings",
        NONE:               null
    },
    alertTypes: {
        SUCCESS:    "alert-success",
        INFO:       "alert-info",
        WARNING:    "alert-warning",
        DANGER:     "alert-danger"
    },
    navbarButtons: {
        OVERVIEW: "navbar-home",
        CALENDAR: "navbar-calendar",
        SETTINGS: "navbar-settings"
    },
    userCreationErrors: {
        FIRSTNAME_MISSING:          "FIRSTNAME_MISSING",
        LASTNAME_MISSING:           "LASTNAME_MISSING",
        EMAIL_MISSING:              "EMAIL_MISSING",
        GRADE_MISSING:              "GRADE_MISSING",
        SCHOOL_LOCATION_MISSING:    "SCHOOL_LOCATION_MISSING",
        PASSWORD_MISSING:           "PASSWORD_MISSING",
        PASSWORD_TOO_SHORT:         "PASSWORD_TOO_SHORT",
        PASSWORDS_DONT_MATCH:       "PASSWORDS_DONT_MATCH",
        EMAIL_ALREADY_IN_USE:       "EMAIL_ALREADY_IN_USE",
        EMAIL_INVALID:              "EMAIL_INVALID"
    },
    userSessionStorageObject: {
        SESSION_ID:         "sessionId",
        FIRSTNAME:          "firstName",
        LASTNAME:           "lastName",
        EMAIL:              "email",
        GRADE:              "grade",
        SCHOOL_LOCATION:    "schoolLocation"
    },
    userEditSuccessCodes: {
        PASSWORD_CHANGED:           "PASSWORD_CHANGED",
        FIRSTNAME_CHANGED:          "FIRSTNAME_CHANGED",
        LASTNAME_CHANGED:           "LASTNAME_CHANGED",
        GRADE_CHANGED:              "GRADE_CHANGED",
        SCHOOL_LOCATION_CHANGED:    "SCHOOL_LOCATION_CHANGED"
    },
    loginErrors: {
        AUTHENTICATION_FAILED:  "AUTHENTICATION_FAILED",
        INTERNAL_ERROR:         "INTERNAL_ERROR"
    },
    createEventErrors: {
        NO_ATTENDANCE_GRADE_SELECTED: "NO_ATTENDANCE_GRADE_SELECTED"
    },
    SLIDE_DURATION: 500
};