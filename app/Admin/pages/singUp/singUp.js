angular.module('adminWebApp.controllers').controller('SingUpCtrl',
	function ($scope, $rootScope, $window, Auth, $location, authView) {

		$window.document.title = "Sing Up | Insider Focus";

    $scope.error = false;

    $scope.singUp = function () {
      $scope.loading = true;
    };  

});
