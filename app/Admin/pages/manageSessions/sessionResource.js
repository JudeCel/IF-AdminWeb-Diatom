
angular.module('adminWebApp.resources')
	.factory('chatSessionResource', function ($resource, errorHandler) {

		var sessionResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/getSession/:sessionId');

		sessionResource.prototype.getSession = function getSession(sessionId, resultCb, errorCb) {
			return sessionResource.get({sessionId: sessionId}, resultCb, errorHandler.defaultServerErrorHandler(errorCb));
		};


		return new sessionResource;
	}
);
