
angular.module('adminWebApp.resources').factory('ManageSessionsCtrlResolver',
	function ($q, $route, Validation, manageSessionsResource, errorHandler, refreshSession, Auth) {

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

			if (!pageName || pageName == 'manageSessions') {
				//refreshSession.refresh(null, function() {
					
					manageSessionsResource.getSessionDataForGrid(successCb, errorHandler.defaultServerErrorHandler());			
			//	});
			//	successCb();
			}

			return deferred.promise;
		};
	}
);
