
angular.module('adminWebApp.resources')
	.factory('emailTemplatesResource', function ($resource, errorHandler) {

		var emailTemplatesResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/emailTemplates');

		emailTemplatesResource.prototype.load = function load(resultCb, errorCb) {
			return emailTemplatesResource.get(resultCb, errorHandler.defaultServerErrorHandler(errorCb));
		};

		return new emailTemplatesResource;
	}
);
