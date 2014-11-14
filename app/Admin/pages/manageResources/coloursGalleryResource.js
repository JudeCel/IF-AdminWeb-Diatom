
angular.module('adminWebApp.resources')
	.factory('coloursGalleryResource', function ($resource, errorHandler) {

		var coloursGalleryResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/coloursGallery');

		coloursGalleryResource.prototype.load = function load(resultCb, errorCb) {
			return coloursGalleryResource.get(resultCb, errorHandler.defaultServerErrorHandler(errorCb));
		};

		return new coloursGalleryResource;
	}
);
