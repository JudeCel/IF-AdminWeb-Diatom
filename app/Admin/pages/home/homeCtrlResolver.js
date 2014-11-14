
angular.module('adminWebApp.resources').factory('HomeCtrlResolver',
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

			if (!pageName || pageName == 'home') {
				refreshSession.refresh(null, function() {
					homeResource.load(successCb, errorHandler.defaultServerErrorHandler());
				});
			}

			return deferred.promise;
		};
	}
);
