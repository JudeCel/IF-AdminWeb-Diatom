
angular.module('adminWebApp.controllers').controller('ContactListsCtrl', ['$scope', '$rootScope', '$routeParams', 'authView',
		'$location', 'tabUtil', 'resolveData', 'refreshSession', '$window',
		function ($scope, $rootScope, $routeParams, authView, $location, tabUtil, resolveData, refreshSession, $window) {

			$scope.resolvedData = resolveData;

			refreshSession.refresh();
}]);