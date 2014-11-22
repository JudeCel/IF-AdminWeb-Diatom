
angular.module('adminWebApp.resources')
	.factory('sessionResource', function ($resource, errorHandler) {

		var SessionResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/session/expire');

		SessionResource.prototype.expireSession = function expireSession(sessionId, resultCb, errorCb) {
			return SessionResource.save({}, resultCb, errorHandler.defaultServerErrorHandler(errorCb));
		};

		return new SessionResource;
	}
);
