
angular.module('adminWebApp.resources').factory('ManageProfileCtrlResolver',
	function ($q, $route, changeContactDetailsResource, Validation, errorHandler, refreshSession, Auth, $rootScope) {

		return function () {
			var deferred = $q.defer();
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

			if (tabName == 'reviewAndAddFeatures' || !tabName) {
				successCb(['passThrough']);
			} else if (tabName == 'changeContactDetails') {
				changeContactDetailsResource.getUser(successCb, errorHandler.defaultServerErrorHandler());
			
			} else if (tabName == 'changePaymentDetails') {
				successCb(['passThrough']);
			} else if (tabName == 'organizeAccountManagers') {
				successCb(['passThrough']);
			} else if (tabName == 'changePasswords') {
				successCb(['passThrough']);
			}	else {
				successCb(['passThrough']);
			}

			return deferred.promise;
		};
	}
);
