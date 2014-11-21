angular.module('adminWebApp.controllers').controller('LogoutCtrl',
	function ($scope, $rootScope, $window,  $location,  Auth, $cookieStore, $cookies, $http) {

		delete $http.defaults.headers.common['x-if-sess'];

		$cookies.sess0 = '';
		window.location = "http://localhost:6600/register";
});
