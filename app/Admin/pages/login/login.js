angular.module('adminWebApp.controllers').controller('LoginCtrl',
	function ($scope, $rootScope, $window,  $location,  Auth) {
		$window.document.title = "Login | Insider Focus ";
      $scope.error = false;

      $scope.login = function () {
        $scope.loading = true;
      };    
});
