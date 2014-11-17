
angular.module('adminWebApp.resources')
	.factory('galleryResource', function ($resource, errorHandler) {

		var galleryResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/gallery');

		galleryResource.prototype.gallerySetup = function gallerySetup(resultCb, errorCb) {
			return galleryResource.query(resultCb, errorHandler.defaultServerErrorHandler(errorCb));
		};

		galleryResource.prototype.deleteResource = function deleteResource(ids, resultCb, errorCb) {
			return galleryResource.save(ids, resultCb, errorHandler.defaultServerErrorHandler(errorCb));
		};

		return new galleryResource;
	}
);
