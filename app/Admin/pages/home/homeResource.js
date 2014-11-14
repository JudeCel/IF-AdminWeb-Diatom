
angular.module('adminWebApp.resources')
	.factory('homeResource', function ($resource, errorHandler) {

		var homeRes = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/admin-home');

		homeRes.prototype.load = function load(resultCb, errorCb) {
			return homeRes.get(resultCb, errorHandler.defaultServerErrorHandler(errorCb));
		};

		return new homeRes;
	}
);
