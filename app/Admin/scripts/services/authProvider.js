

angular.module('adminWebApp.services').factory('Auth', function ($q) {
	var userPermission;
	var p = $q.defer();

	function setUserPermissions(value) {
		userPermission = value;
		p.resolve(value);
	}

	function userRole() {
		return userPermission;
	}

	function getRolePromise() {
		return p.promise;
	}

	return {
		setUserPermissions: setUserPermissions,
		userRole: userRole,
		getRolePromise: getRolePromise
	};
});
