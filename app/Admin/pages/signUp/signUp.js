angular.module('adminWebApp.controllers').controller('SignUpCtrl',
	function ($scope, $rootScope, $window, Auth, $location, authView) {

		$window.document.title = "Sign Up | Insider Focus";

	    $scope.error = false;

	    $scope.signUp = function () {
		    $scope.loading = true;
	    };

});
