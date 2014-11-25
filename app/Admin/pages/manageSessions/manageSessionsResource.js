
angular.module('adminWebApp.resources')
	.factory('manageSessionsResource', function ($resource, errorHandler) {

		var dropSessionResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/dropSession');
		var copySessionResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/copySession');
		var manageSessionsResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/getSessions');

		manageSessionsResource.prototype.getSessions = function getSessions (resultCb, errorCb) {
			return manageSessionsResource.query( resultCb, errorHandler.defaultServerErrorHandler(errorCb));
		};

		manageSessionsResource.prototype.dropSession = function dropSession(sessionId, resultCb, errorCb) {
			return dropSessionResource.remove( {sessionId: sessionId}, resultCb, errorHandler.defaultServerErrorHandler(errorCb));
		};

		manageSessionsResource.prototype.copySession = function copySession(sessionId, resultCb, errorCb) {
			return copySessionResource.query( {sessionId: sessionId}, resultCb, errorHandler.defaultServerErrorHandler(errorCb));
		};

		return new manageSessionsResource;
	}
);
