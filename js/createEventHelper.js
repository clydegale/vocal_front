(function($){
    "use strict";


    $('#createEventForm').submit(function(event) {
        event.preventDefault();
        console.log("Default Prevented: createEventForm");

        //clear all red borders if there are any
        clearFormErrors();
        // conditions check if the checkboxes are checked and disables the hidden input field accordingly
        // hidden inputs are required to send key=false instead of nothing in the post request
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
        var form = $('#createEventForm');
        var formData = form.serializeArray();
        var startDate = _.find(formData, function(formObjects) {return formObjects.name == "startdate"}).value;
        var startTime = _.find(formData, function(formObjects) {return formObjects.name == "starttime"}).value;
        var endDate = _.find(formData, function(formObjects) {return formObjects.name == "enddate"}).value;
        var endTime = _.find(formData, function(formObjects) {return formObjects.name == "endtime"}).value;
        debugger;

        // isDateStringValid returns the date Format if the date is matched, vaild are:
        // YYYY-MM-DD or DD.MM.YYYY
        var startDateFormat = isDateStringValid(startDate);
        var endDateFormat = isDateStringValid(endDate);

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
        var startDateObj = {
            name: "startdate",
            value: createUnixTimestamp(startDate, startTime, startDateFormat)
        }
        var endDateObj = {
            name: "enddate",
            value: createUnixTimestamp(endDate, endTime, endDateFormat)
        }

        resultArray.push(startDateObj);
        resultArray.push(endDateObj);

        var postStringArray = [];
        _.each(resultArray, function(o) {
            postStringArray.push(o.name + "=" + encodeURIComponent(o.value))
        });
        var postString = postStringArray.join("&");

        debugger;
        $.securityCrucialAjaxPOST({
            url : managerProperties.services.CREATE_EVENT_URL,
            dataType : 'json',
            type : 'POST',
            async : true,
            data : postString
        }).done(function(errorDTO) {
             console.log(errorDTO)
                _handleCreateEventErrors(errorDTO)
            }).fail(function() {
                console.log("eventCreat Query Failed")
            });
    });

    function _handleCreateEventErrors(errorDTO) {
        console.log(errorDTO);
        if(errorDTO["success"]) {
            console.log("success == 1");
            showAlert(managerProperties.alertTypes.SUCCESS, "Das Event wurde erfolgreich erstellt") //
            resetForm("createEventForm");
            return;
        }
        var errorMessage = "";
        // TODO: add delay, so fields wont show up as red before the error message is displayed
        if($.inArray(managerProperties.createEventErrors.TITLE_MISSING, errorDTO.content) != -1) {
            console.log("Missing title");
            $('#eventtitle').parents(".form-group").addClass("has-error")
            errorMessage += 'Das Feld <b>Titel</b> darf nicht leer sein <br>'
        }
        if($.inArray(managerProperties.createEventErrors.STARTDATE_MISSING, errorDTO.content) != -1) {
            console.log("Missing Startdate");
            $('#startdate').parents(".form-group").addClass("has-error")
            errorMessage += 'Bitte geben sie ein <b>Startdadum</b> ein<br>'
        }
        if($.inArray(managerProperties.createEventErrors.STARTDATE_MISSING, errorDTO.content) != -1) {
            console.log("Missing Startdate");
            $('#enddate').parents(".form-group").addClass("has-error")
            errorMessage += 'Bitte geben sie ein <b>Startdadum</b> ein<br>'
        }
        // start>end
        if($.inArray(managerProperties.createEventErrors.STARTDATE_AFTER_ENDDATE, errorDTO.content) != -1) {
            console.log("Startdate after enddate");
            $('#startdate').parents(".form-group").addClass("has-error")
            $('#enddate').parents(".form-group").addClass("has-error")
            errorMessage += 'Der gewählten <b>Start</b> liegt nach dem <b>Ende</b>'
        }
        if($.inArray(managerProperties.createEventErrors.EVENT_TYPE_MISSING, errorDTO.content) != -1) {
            console.log("Missing Eventtype");
            $('#eventtype').parents(".form-group").addClass("has-error")
            errorMessage += 'Bitte wählen sie einen <b>Eventtyp</b> aus<br>'
        }
        if($.inArray(managerProperties.createEventErrors.NO_ATTENDANCE_GRADE_SELECTED, errorDTO.content) != -1) {
            console.log("Missing Attendance");
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
            var year = dateStringArray[2] - 1;
        }
        if(dateStringFormat == managerProperties.formats.ISO_FORMAT) {
            var dateStringArray = dateString.split("-");
            var day = dateStringArray[2];
            var month = dateStringArray[1] - 1;
            var year = dateStringArray[0] - 1;
        }
        var timeStringArray = timeString.split(":");
        var hour = timeStringArray[0];
        var minute = timeStringArray[1];

        return new Date(year, month, day, hour, minute).getTime();
    }

    // 05.05.2013
    function isDateStringValid(dateString) {
        var regexGermanDate = /(?:[01][1-9]|2[0-9]|3[0-1])\.(?:0[1-9]|1[0-2])\.[0-9]{4}/;
        var regexISODate = /[0-9]{4}-(?:0[1-9]|1[0-2])-(?:[0][1-9]|[1][0-9]|2[0-9]|3[0-1])/;
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