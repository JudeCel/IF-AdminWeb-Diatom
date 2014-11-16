
angular.module('adminWebApp.resources').factory('ManageResourcesCtrlResolver',
	function ($q, $route, galleryResource, contactListsResource, topicsResource, emailTemplatesResource, coloursGalleryResource, Validation, errorHandler, refreshSession, Auth) {

		return function () {
			var deferred = $q.defer();
			var pageName = $route.current.params.pageName || $route.current.pageName;
			var tabName = $route.current.params.tabName;

			var successCb = function (result) {
				Auth.getRolePromise().then(function() {
					deferred.resolve(result);
				});
			}

			// let the controller handle the validate
			if (!Validation.validate()) {
				deferred.reject(false);
				return deferred.promise;
			}

			if (tabName == 'gallery') {
				galleryResource.gallerySetup(successCb, errorHandler.defaultServerErrorHandler());
			} else if (tabName == 'contactLists') {
				contactListsResource.contactListsSetup(successCb, errorHandler.defaultServerErrorHandler());
			} else if (tabName == 'topics') {
				topicsResource.topicsSetup(successCb, errorHandler.defaultServerErrorHandler());
			} else if (tabName == 'emailTemplates') {
				emailTemplatesResource.emailsSetup(successCb, errorHandler.defaultServerErrorHandler());
			} else if (tabName == 'coloursGallery') {
				coloursGalleryResource.coloursSetup(successCb, errorHandler.defaultServerErrorHandler());
			}
			else {
				successCb(['passThrough']);
			}

			return deferred.promise;
		};
	}
);
