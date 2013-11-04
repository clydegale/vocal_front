"use strict";

console.log("properties loaded");

var managerProperties = {
    dirs: {
        TEMPLATE_UI_DIR : "tmpls/ui/",
        TEMPLATE_CALENDAR: "tmpls/calendar/",
        jsDir : "js/"
    },
    services : {
        locationSelectorURL: "http://vocal.pi:8080/VoCalServices/MockService/getLocations"
    },
    siteStates: {
        loginScreen: "loginScreen",
        accountCreation: "accountCreation",
        overview: "overview",
        calendar: "calendar",
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