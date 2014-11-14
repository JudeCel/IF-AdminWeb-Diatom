
angular.module('adminWebApp.resources')
	.factory('galleryResource', function ($resource, errorHandler) {

		var galleryRes = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/gallery');

		galleryRes.prototype.load = function load(resultCb, errorCb) {
			return galleryRes.get(resultCb, errorHandler.defaultServerErrorHandler(errorCb));
		};

		return new galleryRes;
	}
);
