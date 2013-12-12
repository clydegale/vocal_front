(function($){
    "use strict";


    $('#createEventForm').submit(function(event) {
        event.preventDefault();
        console.log("Default Prevented: createEventForm");

        //clear all red borders if there are any
        clearFormErrors();

        // These conditions check if the checkboxes are checked and disables the hidden input field accordingly
        // hidden inputs are required to send key=false instead of nothing in the post request. an empty key can not be
        // handled by the webservice
        if($('#child').prop("checked")) {
            $('#childHidden').prop('disabled', true);
        }
        if($('#disciple').prop("checked")) {
            $('#discipleHidden').prop('disabled', true);
        }
        if($('#trainer').prop("checked")) {
            $('#trainerHidden').prop('disabled', true);
        }
        if($('#master').prop("checked")) {
            $('#masterHidden').prop('disabled', true);
        }

        // This whole section is necessary so the time sent to the server will be in unixtime * 1000 (ms). on the
        // serverside the event start and end is exclusively handled via unixtime.
        // If the normal form input would be used the server would get a {start,end} date and {start,end} time which
        // are two parameters too much.

        // get the start and end dates/times
        var form = $('#createEventForm');
        var formData = form.serializeArray();
        var startDate = _.find(formData, function(formObjects) {return formObjects.name == "startdate"}).value;
        var startTime = _.find(formData, function(formObjects) {return formObjects.name == "starttime"}).value;
        var endDate = _.find(formData, function(formObjects) {return formObjects.name == "enddate"}).value;
        var endTime = _.find(formData, function(formObjects) {return formObjects.name == "endtime"}).value;

        // isDateStringValid returns the date Format if the date is matched and false if it isnt.
        // vaild are: YYYY-MM-DD or DD.MM.YYYY
        var startDateFormat = isDateStringValid(startDate);
        var endDateFormat = isDateStringValid(endDate);

        // is the date/time data valid? if not, throw an error and stop
        if(!(startDateFormat
        && endDateFormat
        && isTimeStringValid(startTime)
        && isTimeStringValid(endTime))) {
            console.log("A string is wrong: " + startDate + ";" + endDate + ";" + startTime + ";" + endTime);
            var errorString = "";
            errorString += "Bitte ein gültiges Datum und eine gültige Uhrzeit eingeben.<br>";
            errorString += "Korrektes Datum: TT.MM.YYYY<br>";
            errorString += "Korrekte Uhrzeit: SS:MM";
            showAlert(managerProperties.alertTypes.DANGER, errorString);
            $('#startdate').parents(".form-group").addClass("has-error")
            $('#enddate').parents(".form-group").addClass("has-error")
            return;
        }

        // remove the start/end date/time from the array
        var tmpObj = {};
        var resultArray = [];
        while(formData.length > 0) {
            tmpObj = formData.pop();
            if(tmpObj.name === "startdate"
            || tmpObj.name === "starttime"
            || tmpObj.name === "enddate"
            || tmpObj.name === "endtime") {
                continue
            }
            resultArray.push(tmpObj);
        }

        // create a new start and enddate with the extracted data...
        var startDateObj = {
            name: "startdate",
            value: createUnixTimestamp(startDate, startTime, startDateFormat)
        }
        var endDateObj = {
            name: "enddate",
            value: createUnixTimestamp(endDate, endTime, endDateFormat)
        }
        // ...and add it to the array of parameters
        resultArray.push(startDateObj);
        resultArray.push(endDateObj);

        // ensure that the data can be transmitted as a ajax request by URLEncoding all data
        var parameterArray = [];
        _.each(resultArray, function(o) {
            parameterArray.push(o.name + "=" + encodeURIComponent(o.value))
        });
        // build the AJAX POST data string using the key value pairs in the parameter array
        var postString = parameterArray.join("&");

        // query the webservice
        $.securityCrucialAjaxPOST({
            url : managerProperties.services.CREATE_EVENT_URL,
            dataType : 'json',
            type : 'POST',
            async : true,
            data : postString
        }).done(function(errorDTO) {
             console.log(errorDTO)
                securityCrucialErrorHandler(errorDTO, _handleCreateEventErrors)
            }).fail(function() {
                console.log("eventCreat Query Failed")
            });
    });

    function _handleCreateEventErrors(errorDTO) {
        if(errorDTO["success"]) {
            showAlert(managerProperties.alertTypes.SUCCESS, "Das Event wurde erfolgreich erstellt") //
            resetForm("createEventForm");
            return;
        }
        var errorMessage = "";
        // TODO: add delay, so fields wont show up as red before the error message is displayed
        if($.inArray(managerProperties.createEventErrors.TITLE_MISSING, errorDTO.content) != -1) {
            $('#eventtitle').parents(".form-group").addClass("has-error")
            errorMessage += 'Das Feld <b>Titel</b> darf nicht leer sein <br>'
        }
        if($.inArray(managerProperties.createEventErrors.STARTDATE_MISSING, errorDTO.content) != -1) {
            $('#startdate').parents(".form-group").addClass("has-error")
            errorMessage += 'Bitte geben sie ein <b>Startdadum</b> ein<br>'
        }
        if($.inArray(managerProperties.createEventErrors.STARTDATE_MISSING, errorDTO.content) != -1) {
            $('#enddate').parents(".form-group").addClass("has-error")
            errorMessage += 'Bitte geben sie ein <b>Startdadum</b> ein<br>'
        }
        // start>end
        if($.inArray(managerProperties.createEventErrors.STARTDATE_AFTER_ENDDATE, errorDTO.content) != -1) {
            $('#startdate').parents(".form-group").addClass("has-error")
            $('#enddate').parents(".form-group").addClass("has-error")
            errorMessage += 'Der gewählten <b>Start</b> liegt nach dem <b>Ende</b>'
        }
        if($.inArray(managerProperties.createEventErrors.EVENT_TYPE_MISSING, errorDTO.content) != -1) {
            $('#eventtype').parents(".form-group").addClass("has-error")
            errorMessage += 'Bitte wählen sie einen <b>Eventtyp</b> aus<br>'
        }
        if($.inArray(managerProperties.createEventErrors.NO_ATTENDANCE_GRADE_SELECTED, errorDTO.content) != -1) {
            $('#eventAttendanceCheckBoxes').parents(".form-group").addClass("has-error")
            errorMessage += 'Bitte wählen sie mindestens eine <b>Gruppe</b> aus, die <b>eingeladen</b> werden soll.<br>'
        }
        showAlert(managerProperties.alertTypes.DANGER, errorMessage)
    }

    var now = new Date();
    // zero is always appended, if date or month is > 9 only the last 2 characters are used (leaving the 0 behind)
    var dateString = ("0" + now.getDate()).slice(-2) + "." + ("0" + (now.getMonth() + 1)).slice(-2) + "." + (now.getYear() + 1900);
    var timeString = ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2)
    $('#startdate').val(dateString);
    $('#starttime').val(timeString);
    $('#enddate').val(dateString);
    $('#endtime').val(timeString);

    function createUnixTimestamp(dateString, timeString, dateStringFormat) {
        if(dateStringFormat == managerProperties.formats.GERMAN_FORMAT) {
            var dateStringArray = dateString.split(".");
            var day = dateStringArray[0];
            var month = dateStringArray[1] - 1;
            var year = dateStringArray[2];
        }
        if(dateStringFormat == managerProperties.formats.ISO_FORMAT) {
            var dateStringArray = dateString.split("-");
            var day = dateStringArray[2];
            var month = dateStringArray[1] - 1;
            var year = dateStringArray[0];
        }
        var timeStringArray = timeString.split(":");
        var hour = timeStringArray[0];
        var minute = timeStringArray[1];

        return new Date(year, month, day, hour, minute).getTime();
    }

    // 05.05.2013
    function isDateStringValid(dateString) {
        var regexGermanDate = /(?:0[1-9]|1[0-9]|2[0-9]|3[0-1])\.(?:0[1-9]|1[0-2])\.[0-9]{4}/;
        var regexISODate = /[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9]|3[0-1])/;
        if(dateString.match(regexISODate)) {
            return managerProperties.formats.ISO_FORMAT;
        } else if (dateString.match(regexGermanDate)) {
            return managerProperties.formats.GERMAN_FORMAT;
        } else {
            return false;
        }
    }
    // 14:30
    function isTimeStringValid(timeString) {
        var regex = /(?:[0-1][0-9]|2[0-3]):[0-5][0-9]/;
        if(timeString.match(regex)) {
            return true;
        } else {
            return false;
        }
    }

    function clearFormErrors() {
        $('#eventtitle').parents(".form-group").removeClass("has-error")
        $('#startdate').parents(".form-group").removeClass("has-error")
        $('#enddate').parents(".form-group").removeClass("has-error")
        $('#eventtype').parents(".form-group").removeClass("has-error")
        $('#eventAttendanceCheckBoxes').parents(".form-group").removeClass("has-error")
    }

})(jQuery)