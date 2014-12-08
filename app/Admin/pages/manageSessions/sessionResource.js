
angular.module('adminWebApp.resources')
	.factory('chatSessionResource', function ($resource, errorHandler) {

		var sessionResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/chatSession');
//		var fileResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/uploadImage');

		sessionResource.prototype.getSession = function getSession(sessionId, resultCb, errorCb) {
			return sessionResource.get({sessionId: sessionId}, resultCb, errorHandler.defaultServerErrorHandler(errorCb));
		};

//        fileResource.prototype = function uploadImage(sessionId, resultCb, errorCb) {
//            return fileResource.save({}, resultCb, errorHandler.defaultServerErrorHandler(errorCb));
//        };

        sessionResource.prototype.updateSessionFirstStep = function updateSessionFirstStep(session, resultCb, errorCb) {
            return sessionResource.save(session, session, resultCb, errorHandler.validationFaultServerErrorHandler(errorCb));
        };

		return new sessionResource;
	}
);
