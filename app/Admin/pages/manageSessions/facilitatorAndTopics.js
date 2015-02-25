
angular.module('adminWebApp.controllers').controller('FacilitatorAndTopicsCtrl', ['$scope', '$rootScope', '$routeParams', 'authView',
	'$location', 'tabUtil', 'refreshSession', '$window',
	function ($scope, $rootScope, $routeParams, authView, $location, tabUtil, refreshSession, $window) {
//		$scope.resolvedData = $rootScope.resolveData;

		refreshSession.refresh();
	}]);
