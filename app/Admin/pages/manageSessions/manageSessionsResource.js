
angular.module('adminWebApp.resources')
	.factory('manageSessionsResource', function ($resource, errorHandler) {
		
		//{TODO}- fix getSessionDataForGrid handler! Fix route!

		//var manageSessionsResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/getSessionDataForGrid');
		var manageSessionsResource = $resource('http://localhost:7777/getSessionDataForGrid');

		manageSessionsResource.prototype.getSessionDataForGrid = function getSessionDataForGrid (resultCb, errorCb) {
			return manageSessionsResource.query( resultCb, errorHandler.defaultServerErrorHandler(errorCb));
		};

		return new manageSessionsResource;
	}
);
