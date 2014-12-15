
angular.module('adminWebApp.resources')
	.factory('chatSessionResource', function ($resource, errorHandler) {

		var sessionResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/chatSession');

		sessionResource.prototype.getSession = function getSession(sessionId, resultCb, errorCb) {
			return sessionResource.get({sessionId: sessionId}, resultCb, errorHandler.defaultServerErrorHandler(errorCb));
		};

        sessionResource.prototype.updateSessionFirstStep = function updateSessionFirstStep(session, resultCb, errorCb) {
            return sessionResource.save(session, resultCb, errorCb);
        };

		return new sessionResource;
	}
);
