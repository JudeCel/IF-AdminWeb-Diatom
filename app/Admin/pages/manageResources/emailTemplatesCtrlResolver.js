
angular.module('adminWebApp.resources').factory('EmailTemplatesCtrlResolver',
	function ($q, $route, homeResource, Validation, errorHandler, refreshSession, Auth) {

		return function () {
			var deferred = $q.defer();
			var pageName = $route.current.params.pageName || $route.current.pageName;

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

			if (!pageName || pageName == 'gallery') {
				refreshSession.refresh(null, function() {
					homeResource.load(successCb, errorHandler.defaultServerErrorHandler());
				});
			}

			return deferred.promise;
		};
	}
);
