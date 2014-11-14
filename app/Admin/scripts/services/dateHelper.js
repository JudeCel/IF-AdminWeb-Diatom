

angular.module('adminWebApp.services').factory('dateHelper',function () {

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
	return {jsonStringToDate:jsonStringToDate};
});





