angular.module('adminWebApp.resources').factory('DefaultResolver',
	function ($q, Auth) {

		return function () {
			var deferred = $q.defer();

			Auth.getRolePromise().then(function() {
				deferred.resolve();
			});

			return deferred.promise;
		};
	}
);