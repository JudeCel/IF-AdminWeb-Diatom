
angular.module('adminWebApp.resources')
	.factory('topicsResource', function ($resource, errorHandler) {

		var topicsResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/galleryTopics');
		var topicsSessionResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/gallerySessionsPerTopic');

		topicsResource.prototype.topicsSetup = function topicsSetup(resultCb, errorCb) {
			return topicsResource.query(resultCb, errorHandler.defaultServerErrorHandler(errorCb));
		};

		topicsResource.prototype.getSessionsForTopic = function getSessionsForTopic(topicId, resultCb, errorCb) {
			return topicsSessionResource.query({topicId: topicId}, resultCb, errorHandler.defaultServerErrorHandler(errorCb));
		};

		return new topicsResource;
	}
);
