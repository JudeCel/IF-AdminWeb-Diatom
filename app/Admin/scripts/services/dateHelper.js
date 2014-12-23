

angular.module('adminWebApp.services').factory('dateHelper',function ($filter) {

	function int(str) {
		return parseInt(str, 10);
	}


	var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
	function jsonStringToDate(string){
		var match;
		if (match = string.match(R_ISO8601_STR)) {
			var date = new Date(0),
				tzHour = 0,
				tzMin  = 0;
			if (match[9]) {
				tzHour = int(match[9] + match[10]);
				tzMin = int(match[9] + match[11]);
			}
			date.setUTCFullYear(int(match[1]), int(match[2]) - 1, int(match[3]));
			date.setUTCHours(int(match[4]||0) - tzHour, int(match[5]||0) - tzMin, int(match[6]||0), int(match[7]||0));
			return date;
		}
		return string;
	}

    function dateFilter(date) {
        return $filter('date')(date, 'MM-dd-yyyy');
    }

    function timeFilter(date) {
        return $filter('date')(date, 'hh:mm');
    }

    function twoDigits(d) {
        if(0 <= d && d < 10) return "0" + d.toString();
        if(-10 < d && d < 0) return "-0" + (-1*d).toString();
        return d.toString();
    }

    function toMysqlFormat(date) {
        return date.getUTCFullYear() + "-" + twoDigits(1 + date.getUTCMonth()) + "-" + twoDigits(date.getUTCDate()) + " " + twoDigits(date.getUTCHours()) + ":" + twoDigits(date.getUTCMinutes()) + ":" + twoDigits(date.getUTCSeconds());
    }

    function joinDateTime(date, time) {
        if (date === 'undefined' || date === null) {
            return null;
        }
        var d = new Date(date + ' ' + time)
        return toMysqlFormat(d);
    }

    function dateDiff(dateA, dateB) {
        dateA = new Date(dateA);
        dateB = new Date(dateB);
        return dateA.getTime() - dateB.getTime();
    }
    
	return {
        jsonStringToDate: jsonStringToDate,
        toMysqlForma: toMysqlFormat,
        twoDigits: twoDigits,
        joinDateTime: joinDateTime,
        dateFilter: dateFilter,
        timeFilter: timeFilter,
        dateDiff: dateDiff
    };
});





