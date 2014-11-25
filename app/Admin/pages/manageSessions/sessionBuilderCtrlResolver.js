
angular.module('adminWebApp.resources').factory('SessionBuilderCtrlResolver',
	function ($q, $route, galleryResource, contactListsResource, topicsResource, emailTemplatesResource, coloursGalleryResource, Validation, errorHandler, refreshSession, Auth) {

		return function () {
			var deferred = $q.defer();
			var pageName = $route.current.params.pageName || $route.current.pageName;
			//var tabName = $route.current.params.tabName;

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

			if (!pageName || pageName == 'step1') {
				//galleryResource.gallerySetup(successCb, errorHandler.defaultServerErrorHandler());
			} else if (pageName == 'step2') {
				//contactListsResource.contactListsSetup(successCb, errorHandler.defaultServerErrorHandler());
			} else if (pageName == 'step3') {
				//topicsResource.topicsSetup(successCb, errorHandler.defaultServerErrorHandler());
			} else if (pageName == 'step4') {
				//emailTemplatesResource.emailsSetup(successCb, errorHandler.defaultServerErrorHandler());
			} else if (pageName == 'step5') {
				//coloursGalleryResource.coloursSetup(successCb, errorHandler.defaultServerErrorHandler());
			}
			else {
				successCb(['passThrough']);
			}

			return deferred.promise;
		};
	}
);
