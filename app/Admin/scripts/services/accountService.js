
angular.module('adminWebApp.resources')
	.factory('accountService', ['$resource', 'errorHandler', function ($resource, errorHandler) {

	var sessionResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/session');

	return {
		getAccountInfo: function(options, resultCb, errorCb) {
			return sessionResource.get(options, resultCb, errorHandler.defaultServerErrorHandler(errorCb));
		},
		accountInfo: null
	};
}]);
