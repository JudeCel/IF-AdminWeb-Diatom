
angular.module('adminWebApp.resources')
	.factory('contactListsResource', function ($resource, errorHandler) {

		var contactListsResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/contactLists');

		contactListsResource.prototype.load = function load(resultCb, errorCb) {
			return contactListsResource.get(resultCb, errorHandler.defaultServerErrorHandler(errorCb));
		};

		return new contactListsResource;
	}
);
