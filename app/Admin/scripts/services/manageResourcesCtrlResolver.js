
angular.module('adminWebApp.resources').factory('ManageResourcesCtrlResolver',
	function ($q, $route, Auth, galleryResource, contactListsResource, topicsResource, emailTemplatesResource, getColoursGalleryResource, Validation, $location, mtypes, errorHandler) {

		return function () {
			var deferred = $q.defer();

			var tabName = $route.current.params.tabName;

			var successCb = function (result) {
				Auth.getRolePromise().then(function() {
					deferred.resolve();
				});
			};

			// let the controller handle the validate
			if (!Validation.validate()) {
				deferred.reject(false);
				return deferred.promise;
			}

			if (tabName == 'gallery') {
				galleryResource.getGalleryInfo(successCb, errorHandler.defaultServerErrorHandler());
			} else if (tabName == 'contactLists') {
				contactListsResource.getContactLists(successCb, errorHandler.defaultServerErrorHandler());
			} else if (tabName == 'topics') {
				topicsResource.getTopics(successCb, errorHandler.defaultServerErrorHandler());
			} else if (tabName == 'emailTemplates') {
				emailTemplatesResource.getEmailTemplates(successCb, errorHandler.defaultServerErrorHandler());
			} else if (tabName == 'coloursGallery') {
				getColoursGalleryResource.getColoursGallery(seriesId, successCb, errorHandler.defaultServerErrorHandler());
			}

			return deferred.promise;
		};
	}
);