"use strict";

console.log("properties loaded");

var managerProperties = {
    dirs: {
        TEMPLATE_UI : "tmpls/ui/",
        TEMPLATE_CALENDAR: "tmpls/calendar/",
        JS : "js/"
    },
    services : {
        LOCATION_SELECTOR_URL: "http://vocal.pi:8080/VoCalServices/MockService/getLocations"
    },
    siteStates: {
        LOGIN_SCREEN: "loginScreen",
        ACCOUNT_CREATION: "accountCreation",
        OVERVIEW: "overview",
        CALENDAR: "calendar",
        settings: "settings",
        none: null
    },
    alertTypes: {
        SUCCESS: "alert-success",
        INFO: "alert-info",
        WARNING: "alert-warning",
        DANGER: "alert-danger"
    },
    SLIDE_DURATION: 500
};