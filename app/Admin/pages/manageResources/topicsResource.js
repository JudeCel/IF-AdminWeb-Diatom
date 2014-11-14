
angular.module('adminWebApp.resources')
	.factory('topicsResource', function ($resource, errorHandler) {

		var topicsResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/topics');

		topicsResource.prototype.load = function load(resultCb, errorCb) {
			return topicsResource.get(resultCb, errorHandler.defaultServerErrorHandler(errorCb));
		};

		return new topicsResource;
	}
);
