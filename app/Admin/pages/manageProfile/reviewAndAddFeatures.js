
angular.module('adminWebApp.controllers').controller('OrganizeAccountManagersCtrl', ['$scope', '$rootScope', '$routeParams', 'authView',
		'$location', 'tabUtil', 'resolveData', 'refreshSession', '$window',
		function ($scope, $rootScope, $routeParams, authView, $location, tabUtil, resolveData, refreshSession, $window) {

			$window.document.title = "Review and Add Features | Insider Focus";

			$scope.resolvedData = resolveData;

			refreshSession.refresh();
}]);