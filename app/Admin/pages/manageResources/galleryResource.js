
angular.module('adminWebApp.resources')
	.factory('galleryResource', function ($resource, errorHandler) {

		var galleryResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/gallery');

		galleryResource.prototype.gallerySetup = function gallerySetup(resultCb, errorCb) {
			return galleryResource.query(resultCb, errorHandler.defaultServerErrorHandler(errorCb));
		};

		return new galleryResource;
	}
);
