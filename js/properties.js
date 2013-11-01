"use strict"

console.log("properties loaded")

var managerProperties = {
    dirs: {
        templateDir : "tmpls/ui/",
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
    }
}