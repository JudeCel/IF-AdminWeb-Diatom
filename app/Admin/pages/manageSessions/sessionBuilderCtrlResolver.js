
angular.module('adminWebApp.resources').factory('SessionBuilderCtrlResolver',
	function ($q, $route, chatSessionResource, Validation, errorHandler, refreshSession, Auth) {

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
			if (!tabName || tabName == 'step1') {
				chatSessionResource.getSession($route.current.params.sessionId, successCb, errorHandler.defaultServerErrorHandler());
			} else if (tabName == 'step2') {
        successCb(['passThrough']);
			} else if (tabName == 'step3') {
        successCb(['passThrough']);
			} else if (tabName == 'step4') {
        successCb(['passThrough']);
			} else if (tabName == 'step5') {
        successCb(['passThrough']);
			}
			else {
				successCb(['passThrough']);
			}

			return deferred.promise;
		};
	}
);
