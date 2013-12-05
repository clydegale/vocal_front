(function($){
    "use strict"


    $('#createEventForm').submit(function(event) {
        event.preventDefault();
        console.log("Default Prevented: createEventForm");

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

        if(!(isDateStringValid(startDate)
        && isDateStringValid(endDate)
        && isTimeStringValid(startTime)
        && isTimeStringValid(endTime))) {
            console.log("A string is wrong: " + startDate + ";" + endDate + ";" + startTime + ";" + endTime);
            var errorString = "";
            errorString += "Bitte ein gültiges Datum und eine gültige Uhrzeit eingeben.<br>";
            errorString += "Korrektes Datum: TT.MM.YYYY<br>";
            errorString += "Korrekte Uhrzeit: SS:MM";
            showAlert(managerProperties.alertTypes.DANGER, errorString);
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
            value: createUnixTimestamp(startDate, startTime)
        }
        var endDateObj = {
            name: "enddate",
            value: createUnixTimestamp(endDate, endTime)
        }

        resultArray.push(startDateObj);
        resultArray.push(endDateObj);

        var postStringArray = [];
        debugger;
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
        }).done(function(DTO) {
             console.log(DTO)
            }).fail(function() {
                console.log("eventCreat Query Failed")
            });
    });

    var now = new Date();
    // zero is always appended, if date or month is > 9 only the last 2 characters are used (leaving the 0 behind)
    var dateString = ("0" + now.getDate()).slice(-2) + "." + ("0" + (now.getMonth() + 1)).slice(-2) + "." + (now.getYear() + 1900);
    var timeString = ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2)
//    debugger;
    $('#startdate').val(dateString);
    $('#starttime').val(timeString);
    $('#enddate').val(dateString);
    $('#endtime').val(timeString);

    function createUnixTimestamp(dateString, timeString) {
        var dateStringArray = dateString.split(".");
        var day = dateStringArray[0];
        var month = dateStringArray[1] - 1;
        var year = dateStringArray[2] - 1;

        var timeStringArray = timeString.split(":");
        var hour = timeStringArray[0];
        var minute = timeStringArray[1];

        return new Date(year, month, day, hour, minute).getTime();
    }

    // 05.05.2013
    function isDateStringValid(dateString) {
        var regex = /(?:0[1-9]|2[0-9]|3[0-1])\.(?:0[1-9]|1[0-2])\.[0-9]{4}/;
        if(dateString.match(regex)) {
            return true;
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

})(jQuery)