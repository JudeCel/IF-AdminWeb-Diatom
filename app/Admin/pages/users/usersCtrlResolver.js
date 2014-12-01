
angular.module('adminWebApp.resources').factory('UsersCtrlResolver',
	function ($q, $route, usersResource, Auth, Validation) {

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

			if (pageName == 'addContact' || !pageName) {
				successCb(['passThrough']);
				//usersResource.getAddUserSetupForManage(successCb, errorHandler.defaultServerErrorHandler());
			}

			return deferred.promise;
		};
	}
);