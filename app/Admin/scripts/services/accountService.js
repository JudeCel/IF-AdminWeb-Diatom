
angular.module('adminWebApp.resources')
	.factory('accountService', ['$resource', 'errorHandler', function ($resource, errorHandler) {

	var accountResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/account');

	return {
		getAccountInfo: function(options, resultCb, errorCb) {
			return accountResource.get(options, resultCb, errorHandler.defaultServerErrorHandler(errorCb));
		},
		accountInfo: null
	};
}]);
