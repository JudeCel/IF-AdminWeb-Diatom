angular.module('adminWebApp.controllers').controller('LogoutCtrl',
	function ($scope, $rootScope, $window,  $location,  Auth, $cookieStore, $cookies, $http, urlHelper, sessionResource) {

		sessionResource.expireSession(ifConfig.sessId, function() {
			delete $http.defaults.headers.common['x-if-sess'];

			$cookies.sess0 = '';
			window.location = urlHelper.getPublicWebLoginUrl();
		});
});
