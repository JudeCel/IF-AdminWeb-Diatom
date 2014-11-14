
angular.module('adminWebApp.controllers').controller('ChangeYourPasswordCtrl', ['$scope', '$rootScope', '$routeParams', 'authView',
		'$location', 'tabUtil', 'resolveData', 'refreshSession', '$window',
		function ($scope, $rootScope, $routeParams, authView, $location, tabUtil, resolveData, refreshSession, $window) {

			$window.document.title = "Manage Profile | Insider Focus";

			$scope.resolvedData = resolveData;

			refreshSession.refresh();
}]);