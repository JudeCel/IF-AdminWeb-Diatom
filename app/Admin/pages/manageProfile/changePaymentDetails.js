
angular.module('adminWebApp.controllers').controller('ChangePaymentDetailsCtrl', ['$scope', '$rootScope', '$routeParams', 'authView',
		'$location', 'tabUtil', 'resolveData', 'refreshSession', '$window',
		function ($scope, $rootScope, $routeParams, authView, $location, tabUtil, resolveData, refreshSession, $window) {

			$window.document.title = "Change Payment Details | Insider Focus";

			$scope.resolvedData = resolveData;

			refreshSession.refresh();
}]);