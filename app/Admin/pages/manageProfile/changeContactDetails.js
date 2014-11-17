
angular.module('adminWebApp.controllers').controller('ChangeContactDetailsCtrl', ['$scope', '$rootScope', '$routeParams', 'authView',
		'$location', 'tabUtil', 'resolveData', 'refreshSession', '$window',
		function ($scope, $rootScope, $routeParams, authView, $location, tabUtil, resolveData, refreshSession, $window) {

			$window.document.title = "Change Contact Details | Insider Focus";

			$scope.resolvedData = resolveData;

      $scope.saveContact = function (contact) {
        $scope.loading = true;
      }

			refreshSession.refresh();
}]);