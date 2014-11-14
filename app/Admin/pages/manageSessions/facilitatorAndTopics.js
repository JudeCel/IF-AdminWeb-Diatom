
angular.module('adminWebApp.controllers').controller('FacilitatorAndTopicsCtrl', ['$scope', '$rootScope', '$routeParams', 'authView',
	'$location', 'tabUtil', 'resolveData', 'refreshSession', '$window',
	function ($scope, $rootScope, $routeParams, authView, $location, tabUtil, resolveData, refreshSession, $window) {

		$scope.resolvedData = resolveData;

		refreshSession.refresh();
	}]);