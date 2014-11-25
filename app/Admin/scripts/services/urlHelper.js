
angular.module('adminWebApp.services').factory('urlHelper', ['$window', '$location', function($window, $location) {
	function getUrlParam(name) {
		var results = new RegExp('[\\?&amp;]' + name + '=([^&amp;#]*)').exec($window.location.href);
		if (results && results.length > 1) {
			return results[1] || 0;
		}
		else {
			return null;
		}
	}

	function getUrlVars(){
		var vars = [], hash;
		var hashes = $window.location.href.slice($window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++)
		{
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	}

	function getPublicWebLoginUrl() {
		return "http://" + $location.host() + ":" + ifConfig.publicWebAppPort +  "/login";
	}

	function getApiUrl() {
		return "http://" + $location.host() + ":" + ifConfig.apiPort;
	}

	return {
		getUrlParam: getUrlParam,
		getUrlVars: getUrlVars,
		getPublicWebLoginUrl: getPublicWebLoginUrl,
		getApiUrl: getApiUrl
	};
}]);
